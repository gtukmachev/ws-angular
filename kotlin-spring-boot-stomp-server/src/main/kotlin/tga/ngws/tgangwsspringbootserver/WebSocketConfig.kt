package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.config.ChannelRegistration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.messaging.support.MessageHeaderAccessor
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer
import java.security.Principal


@Configuration
@EnableWebSocketMessageBroker
class WebSocketStompEndpointsConfig : WebSocketMessageBrokerConfigurer {
    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/stomp")
                .setAllowedOrigins("*")
                .withSockJS()
    }

    override fun configureMessageBroker(config: MessageBrokerRegistry) {
        config.enableSimpleBroker("/topic")
    }
}

/**
 * Many thanks to Anthony Raymond
 * for the explanation of the security configuring:
 * [https://stackoverflow.com/questions/45405332/websocket-authentication-and-authorization-in-spring]
 */
@Configuration
class WebSocketAuthorizationSecurityConfig : AbstractSecurityWebSocketMessageBrokerConfigurer() {
    override fun configureInbound(messages: MessageSecurityMetadataSourceRegistry) {
        // You can customize your authorization mapping here.
        messages.anyMessage().authenticated()
    }

    // TODO: For test purpose (and simplicity) i disabled CSRF, but you should re-enable this and provide a CRSF endpoint.
    override fun sameOriginDisabled(): Boolean {
        return true
    }
}

@Component
class WebSocketAuthenticatorService {

    private val allowedSubscriptionChannels = listOf(
            "/topic/chat/messages/",
            "/topic/chat/notifications/"
        )

    private val allowedSendChannels = listOf(
            "/queue/chat/messages/"
    )

    private val log = LoggerFactory.getLogger(WebSocketAuthenticatorService::class.java)
    // This method MUST return a UsernamePasswordAuthenticationToken instance,
    // the spring security chain is testing it with 'instanceof' later on.
    // So don't use a subclass of it or any other class
    fun getAuthenticatedOrFail(
                username: String?,
                password: String?,
                chat: String?
    ): UsernamePasswordAuthenticationToken {
        log.trace("getAuthenticatedOrFail($username, $password)")

        if (username.isNullOrBlank()) throw AuthenticationCredentialsNotFoundException("Username can not be null or empty.")
        if (password.isNullOrBlank()) throw AuthenticationCredentialsNotFoundException("Password can not be null or empty.")
        if (password.isNullOrBlank()) throw AuthenticationCredentialsNotFoundException("Chat can not be null or empty.")

        return UsernamePasswordAuthenticationToken(
                username,
                password,
                listOf ( // MUST provide at least one role
                        SimpleGrantedAuthority("ROLE_USER"),
                        SimpleGrantedAuthority("ROLE_CHAT:$chat/$password")
                )
            )
    }

    private fun checkOrRiseError(principal: Principal?, topic: String?, allowedChannels: List<String>, action: String) {
        if ( principal == null     ) throw AuthenticationServiceException("$action declined: User is not defined!")
        if ( topic.isNullOrEmpty() ) throw AuthenticationServiceException("$action declined: Topic is not defined!")
        if ( topic.contains("*")   ) throw AuthenticationServiceException("$action declined: Topic contains '*' symbols!")

        if (principal !is UsernamePasswordAuthenticationToken)  throw AuthenticationServiceException("$action declined: User is not recognized!")

        val channel = allowedChannels.find { topic.startsWith(it) }
                ?: throw AuthenticationServiceException("$action declined: unexpected messages channel!")

        val chatName = topic.substring(channel.length)
        val requiredAuthority = "ROLE_CHAT:$chatName"

        val chatRoleAssigned = principal.authorities.any { it.authority == requiredAuthority }

        if (!chatRoleAssigned) throw AuthenticationServiceException("$action declined: Not enough permissions to work with the chat!")
    }

    fun allowSubscriptionOrRiseError(principal: Principal?, topic: String?) = checkOrRiseError(principal, topic, allowedSubscriptionChannels, "Subscription")

    fun allowSendOrRiseError(principal: Principal?, topic: String?) = checkOrRiseError(principal, topic, allowedSendChannels, "Send message")

}

@Configuration
class WebSecurityConfig : WebSecurityConfigurerAdapter() {
    private val log = LoggerFactory.getLogger(WebSecurityConfig::class.java)

    // Since the Stomp protocol rely on a first HTTP Request, we'll need to authorize HTTP call to our stomp handshake endpoint.
    override fun configure(http: HttpSecurity) {
        log.trace("configure(http)")
        // This is not for websocket authorization, and this should most likely not be altered.
        http
                .httpBasic().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                    .antMatchers("/stomp").permitAll()
                    .antMatchers("/stomp/**").permitAll()
                    .anyRequest().denyAll()
    }
}

@Component
class AuthChannelInterceptorAdapter(
        private val authService: WebSocketAuthenticatorService,
        private val userService: UsersService
) : ChannelInterceptor {

    companion object {
        private val log = LoggerFactory.getLogger(AuthChannelInterceptorAdapter::class.java)
    }

    override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
        log.trace("preSend( message = '$message', channel = '$channel')")

        val accessor: StompHeaderAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)!!
        when(accessor.command) {
            StompCommand.CONNECT -> {
                val username = accessor.getFirstNativeHeader("login")
                val password = accessor.getFirstNativeHeader("pass")
                val chat = accessor.getFirstNativeHeader("chat")
                val user = authService.getAuthenticatedOrFail(username, password, chat)
                accessor.user = user
            }
            StompCommand.SUBSCRIBE -> {
                authService.allowSubscriptionOrRiseError(accessor.user, accessor.destination)
                userService.addUser(accessor.user, accessor.destination)
            }
            StompCommand.SEND      -> authService.allowSendOrRiseError(accessor.user, accessor.destination)
            else -> { }
        }

        return message
    }
}

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
class WebSocketAuthenticationSecurityConfig(
        val authChannelInterceptorAdapter: AuthChannelInterceptorAdapter
) : WebSocketMessageBrokerConfigurer {

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        // Endpoints are already registered on WebSocketConfig, no need to add more.
    }

    override fun configureClientInboundChannel(registration: ChannelRegistration) {
        registration.interceptors(authChannelInterceptorAdapter)
    }
}


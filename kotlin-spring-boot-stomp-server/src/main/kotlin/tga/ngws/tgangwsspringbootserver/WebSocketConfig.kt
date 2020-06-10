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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.GrantedAuthority
import org.springframework.stereotype.Component
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

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
    private val log = LoggerFactory.getLogger(WebSocketAuthenticatorService::class.java)
    // This method MUST return a UsernamePasswordAuthenticationToken instance,
    // the spring security chain is testing it with 'instanceof' later on.
    // So don't use a subclass of it or any other class
    fun getAuthenticatedOrFail(username: String?, password: String?): UsernamePasswordAuthenticationToken {
        log.trace("getAuthenticatedOrFail($username, $password)")

        if (username.isNullOrBlank()) throw AuthenticationCredentialsNotFoundException("Username was null or empty.")
        if (password.isNullOrBlank()) throw AuthenticationCredentialsNotFoundException("Password was null or empty.")

        // Add your own logic for retrieving user in fetchUserFromDb()
/*
        if ( !(username == "admin" && password == "pass") ) {
            throw BadCredentialsException("Bad credentials for user $username")
        }
*/

        // null credentials, we do not pass the password along
        return UsernamePasswordAuthenticationToken(
                username,
                password,
                listOf(GrantedAuthority { "USER" }) // MUST provide at least one role
        )
    }
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
                    .antMatchers("/adm/msg").permitAll()
                    .anyRequest().denyAll()
    }
}

@Component
class AuthChannelInterceptorAdapter(private val webSocketAuthenticatorService: WebSocketAuthenticatorService) : ChannelInterceptor {

    companion object {
        private val log = LoggerFactory.getLogger(AuthChannelInterceptorAdapter::class.java)
        private const val USERNAME_HEADER = "login"
        private const val PASSWORD_HEADER = "pass"
    }

    override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
        log.trace("preSend( message = '$message', channel = '$channel')")

        val accessor: StompHeaderAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)!!
        if (StompCommand.CONNECT == accessor.command) {
            val username = accessor.getFirstNativeHeader(USERNAME_HEADER)
            val password = accessor.getFirstNativeHeader(PASSWORD_HEADER)
            val user = webSocketAuthenticatorService.getAuthenticatedOrFail(username, password)
            accessor.user = user
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


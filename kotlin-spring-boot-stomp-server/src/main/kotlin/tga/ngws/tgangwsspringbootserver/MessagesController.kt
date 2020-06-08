package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.messaging.Message
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller
import java.security.Principal


@Controller
class MessagesController(val messagingTemplate: SimpMessageSendingOperations) {

    private val log = LoggerFactory.getLogger(MessagesController::class.java)

    @MessageMapping("/queue/chat/messages/**")
    fun greeting(msg: Message<String>, principal: Principal) {
        val queue = (msg.headers["lookupDestination"]) as String
        val topic = "/topic" + queue.substring("/queue".length)
        log.trace("{} <== {{}:'{}'} ==> {})",queue, principal.name, msg.payload, topic)
        messagingTemplate.convertAndSend(topic, Msg(principal.name, msg.payload))
    }

    @SubscribeMapping("/topic/chat/messages/**")
    fun onSubscribe(msg: Message<Any?>, user: Principal) {
        log.trace("onSubscribe()")
        val topic = (msg.headers["lookupDestination"]) as String
        messagingTemplate.convertAndSend(topic, Msg.server("A new user has joined: " + user.name))
    }

}

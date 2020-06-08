package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller
import java.security.Principal


@Controller
class MessagesController(val messagingTemplate: SimpMessageSendingOperations) {

    private val log = LoggerFactory.getLogger(MessagesController::class.java)

    @MessageMapping("/topic/chat/add")
    @SendTo("/topic/chat/messages")
    fun greeting(msgText: String, principal: Principal): Msg {
        log.info("/topic/chat/add <== {{}:'{}'} ==> /topic/chat/messages)", principal.name, msgText)
        return Msg(principal.name, msgText)
    }

    @SubscribeMapping("/topic/chat/messages")
    fun onSubscribe(user: Principal) {
        log.trace("onSubscribe()")
        //return "Server message > you've been subscribed to '/topic/chat/messages'!"
        messagingTemplate.convertAndSend("/topic/chat/messages", Msg.server("A new user has joined: " + user.name))
    }

}

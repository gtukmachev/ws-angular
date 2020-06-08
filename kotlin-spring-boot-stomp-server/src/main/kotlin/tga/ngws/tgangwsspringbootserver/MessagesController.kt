package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller
import java.security.Principal


@Controller
class MessagesController {

    private val log = LoggerFactory.getLogger(MessagesController::class.java)

    @MessageMapping("/topic/chat/add")
    @SendTo("/topic/chat/messages")
    fun greeting(msgText: String, principal: Principal): Map<String, String> {
        log.info("/topic/chat/add <== {{}:'{}'} ==> /topic/chat/messages)", principal.name, msgText)
        return mapOf(
                "user" to principal.name,
                "msg" to msgText
        )
    }

    @SubscribeMapping("/topic/chat/messages")
    fun onSubscribe(user: Principal): String {
        log.trace("onSubscribe()")
        return "Server message > you've been subscribed to '/topic/chat/messages'!"
    }

}

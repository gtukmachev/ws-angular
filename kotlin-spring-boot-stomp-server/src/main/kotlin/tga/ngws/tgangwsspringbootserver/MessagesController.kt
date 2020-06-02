package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller
import org.springframework.web.util.HtmlUtils
import java.security.Principal


@Controller
class MessagesController {

    private val log = LoggerFactory.getLogger(MessagesController::class.java)

    @MessageMapping("/topic/chat/add")
    @SendTo("/topic/chat/messages")
    fun greeting(message: String, user: Principal): String {
        log.info("/app/addmsg ==> '$message' ==> /topic/demo)")
        return "> " + HtmlUtils.htmlEscape(user.name  + ": " + message)
    }

    @SubscribeMapping("/topic/chat/messages")
    fun onSubscribe(user: Principal): String {
        log.trace("onSubscribe()")
        return "Server message > you've been subscribed to '/topic/chat/messages'!"
    }

}

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

    @MessageMapping("/addmsg")
    @SendTo("/topic/demo")
    fun greeting(message: String, user: Principal): String {
        log.info("/app/addmsg ==> '$message' ==> /topic/demo)")
        return "> " + HtmlUtils.htmlEscape(user.name  + ": " + message)
    }

    @SubscribeMapping("/demo") //actually, the full destination name (that client is using) is '/topic/demo' or '/app/demo'
    fun onSubscribe_Topic__Demo(user: Principal): String {
        log.trace("onSubscribe_Topic__Demo()")
        return "Server message > you've been subscribed to '/topic/demo'!"
    }


}

package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import org.springframework.web.util.HtmlUtils


@Controller
class MessagesController {

    private val log = LoggerFactory.getLogger(MessagesController::class.java)

    @MessageMapping("/addmsg")
    @SendTo("/topic/demo")
    fun greeting(message: String): String {
        log.info("/app/addmsg ==> '$message' ==> /topic/demo)")
        return "> " + HtmlUtils.htmlEscape(message)
    }
}

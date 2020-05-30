package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import org.springframework.web.util.HtmlUtils


@Controller
class MessagesController {

    val log = LoggerFactory.getLogger(MessagesController::class.java)

    @MessageMapping("/addmsg")
    @SendTo("/topic/demo")
    fun greeting(message: String): String {
        log.info("/queue/addmsg ->greeting(message = '$message')")

        Thread.sleep(1000) // simulated delay

        return "> " + HtmlUtils.htmlEscape(message)
    }
}

package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicInteger

@RestController
@RequestMapping("/adm")
class AdminController {
    val log = LoggerFactory.getLogger(AdminController::class.java)
    val counter = AtomicInteger(0)

    @Autowired
    lateinit var messagingTemplate: SimpMessageSendingOperations


    @GetMapping("/msg")
    fun msg(): String {
        log.info("/adm/msg -> msg()")
        val theText = "Server message " + counter.incrementAndGet()

        messagingTemplate.convertAndSend("/topic/demo", theText)

        return theText
    }

}

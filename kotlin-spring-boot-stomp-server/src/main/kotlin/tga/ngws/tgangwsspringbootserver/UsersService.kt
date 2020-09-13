package tga.ngws.tgangwsspringbootserver

import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.security.Principal
import java.util.*
import java.util.concurrent.ConcurrentLinkedQueue

@Service
class UsersService {

    companion object {
        private val log = LoggerFactory.getLogger(UsersService::class.java)
    }

    private val usersRegisteringQueue: Queue<Pair<Principal?, String?>> = ConcurrentLinkedQueue()

    fun addUser(principal: Principal?, chat: String?) {
        usersRegisteringQueue.add(principal to chat)
    }

    @Scheduled(fixedDelay = 2_000)
    fun notifyChatsAboutNewUsers() {
        while(usersRegisteringQueue.isNotEmpty()) {
            val (user: Principal?, chat: String?) = usersRegisteringQueue.poll()
            log.info("NEW USER: @{} has entered to chat [{}]", user?.name, chat)
        }
    }

}

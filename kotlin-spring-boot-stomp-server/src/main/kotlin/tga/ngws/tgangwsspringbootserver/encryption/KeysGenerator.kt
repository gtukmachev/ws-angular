package tga.ngws.tgangwsspringbootserver.encryption

import org.springframework.stereotype.Service
import java.security.KeyPair
import java.security.KeyPairGenerator




@Service
class KeysGenerator {

    fun generateKeysPair(): KeyPair {
        val kpg = KeyPairGenerator.getInstance("RSA")
        kpg.initialize(2048)
        val kp = kpg.generateKeyPair()
        return kp
    }

}

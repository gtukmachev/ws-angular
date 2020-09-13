package tga.ngws.tgangwsspringbootserver.encryption

import org.springframework.stereotype.Service
import java.security.PublicKey
import java.util.*
import javax.crypto.Cipher


@Service
class EncryptionService {

    fun encryptToBase64(text: String, pubKey: PublicKey): String {
        val encoder: Base64.Encoder = Base64.getEncoder()
        val encryptedBytes = encryptToBytes(text, pubKey)
        return encoder.encodeToString(encryptedBytes)
    }

    fun encryptToBytes(text: String, pubKey: PublicKey): ByteArray {
        val bytesToEncrypt = text.toByteArray(charset= Charsets.UTF_8)

        //val cipher: Cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding")
        val cipher: Cipher = Cipher.getInstance("RSA")
        cipher.init(Cipher.ENCRYPT_MODE, pubKey)

        return cipher.doFinal(bytesToEncrypt)
    }
}

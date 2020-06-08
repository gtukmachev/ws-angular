package tga.ngws.tgangwsspringbootserver

data class Msg(val user: String, val msg: String) {
    companion object {
        fun server(msg: String) = Msg("server", msg)
    }
}

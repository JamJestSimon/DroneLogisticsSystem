package pl.edu.wat.uavlogistics.controller

import io.dronefleet.mavlink.MavlinkConnection
import io.dronefleet.mavlink.common.CommandLong
import io.dronefleet.mavlink.common.MavCmd
import java.io.InputStream
import java.io.OutputStream
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetSocketAddress

/** Sends MAV_CMD_DO_SET_HOME (param1=1 → current position) outside MissionRaw upload. */
internal object MavlinkDoSetHome {
    private const val GCS_SYSTEM_ID = 255
    private const val GCS_COMPONENT_ID = 190

    fun setHomeToCurrentPosition(connectionString: String, targetSystem: Int) {
        val port = connectionString.substringAfterLast(":").toIntOrNull()
            ?: throw IllegalArgumentException("Invalid mavlink connection: $connectionString")
        val host = connectionString.removePrefix("udp://")
            .substringBefore(":")
            .ifBlank { "127.0.0.1" }
            .let { if (it == "0.0.0.0") "127.0.0.1" else it }
        val remote = InetSocketAddress(host, port)

        DatagramSocket().use { socket ->
            val out = UdpOutputStream(socket, remote)
            val connection = MavlinkConnection.create(InputStream.nullInputStream(), out)
            connection.send2(
                GCS_SYSTEM_ID,
                GCS_COMPONENT_ID,
                CommandLong.builder()
                    .targetSystem(targetSystem)
                    .targetComponent(1)
                    .command(MavCmd.MAV_CMD_DO_SET_HOME)
                    .confirmation(0)
                    .param1(1f)
                    .build(),
            )
        }
    }

    private class UdpOutputStream(
        private val socket: DatagramSocket,
        private val remote: InetSocketAddress,
    ) : OutputStream() {
        override fun write(b: Int) {
            write(byteArrayOf(b.toByte()))
        }

        override fun write(b: ByteArray, off: Int, len: Int) {
            socket.send(DatagramPacket(b, off, len, remote))
        }
    }
}

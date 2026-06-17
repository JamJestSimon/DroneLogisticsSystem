package pl.edu.wat.uavlogistics.frontend

import kotlinx.browser.document
import org.w3c.dom.HTMLElement
import pl.edu.wat.uavlogistics.frontend.dom.DomApp

fun main() {
    val root = document.getElementById("root") as HTMLElement
    DomApp.mount(root)
}

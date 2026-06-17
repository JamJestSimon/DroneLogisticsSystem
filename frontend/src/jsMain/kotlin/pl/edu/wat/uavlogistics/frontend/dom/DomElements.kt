package pl.edu.wat.uavlogistics.frontend.dom

import kotlinx.browser.document
import org.w3c.dom.HTMLElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLLabelElement
import org.w3c.dom.HTMLPreElement

internal fun el(tag: String, className: String? = null, text: String? = null): HTMLElement {
    val node = document.createElement(tag) as HTMLElement
    if (className != null) node.className = className
    if (text != null) node.textContent = text
    return node
}

internal fun button(label: String, className: String? = null, onClick: () -> Unit): HTMLElement {
    val node = el("button", className, label)
    node.onclick = { onClick(); null }
    return node
}

internal fun labeledInput(
    label: String,
    value: String = "",
    type: String = "text",
    onChange: ((String) -> Unit)? = null,
): Pair<HTMLLabelElement, HTMLInputElement> {
    val labelEl = document.createElement("label") as HTMLLabelElement
    labelEl.textContent = label
    val input = document.createElement("input") as HTMLInputElement
    input.type = type
    input.value = value
    if (onChange != null) {
        input.oninput = { onChange(input.value); null }
    }
    return labelEl to input
}

internal fun labeledCheckbox(label: String, checked: Boolean, onChange: (Boolean) -> Unit): HTMLElement {
    val wrap = el("label")
    val input = document.createElement("input") as HTMLInputElement
    input.type = "checkbox"
    input.checked = checked
    input.onchange = { onChange(input.checked); null }
    wrap.appendChild(input)
    wrap.append(" $label")
    return wrap
}

internal fun HTMLElement.clearChildren() {
    while (firstChild != null) removeChild(firstChild!!)
}

/** JS throwables often have no Kotlin [Throwable.message]; use toString() as fallback. */
internal fun failureMessage(cause: Throwable): String =
    cause.message?.takeIf { it.isNotBlank() } ?: cause.toString()

internal fun logPre(): HTMLPreElement = document.createElement("pre") as HTMLPreElement

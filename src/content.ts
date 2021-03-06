import { TypedMsg } from "./common";
import { Parser } from "json2csv"

browser.runtime.onMessage.addListener((_ev: any) => {
    const ev = _ev as TypedMsg
    if (ev.type === 'copySelectedLinks') {
        copySelectedLinksIntoClipboard()
    }
})

function copySelectedLinksIntoClipboard() {
    const links = getLinksFromSelection()
    if (links === null) { return }
    // const formatted: string = links.map(x => `${x.link}`).join('\n')
    const formatted: string = serializeToCsv(links)
    navigator.clipboard.writeText(formatted)
    alert(`${links.length} link${links.length ? 's' : ''} copied!`)
}

interface Item {
    title: string
    link: string
}

function getLinksFromSelection(): Item[] | null {
    const selection = window.getSelection()
    const fin: Item[] = []
    if (!selection) {
        alert('Please select text first!')
        return null
    }
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0)
        var div = document.createElement('DIV')
        div.appendChild(range.cloneContents())
        var links = div.getElementsByTagName("A")
        for (var i = 0; i < links.length; i++) {
            const a = links[i] as HTMLLinkElement
            fin.push({
                link: a.href,
                title: a.innerText,
            })
        }
    }
    if (fin.length === 0) {
        alert('No link found in selection area.')
        return null
    }
    return fin
}

function serializeToCsv(jsonObj: any): string {
    try {
        const parser = new Parser({})
        const csv = parser.parse(jsonObj)
        return csv
    } catch (err) {
        console.error(err)
        return ''
    }
}

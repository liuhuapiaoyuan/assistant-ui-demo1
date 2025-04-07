import {  useToolUIsStore } from "@assistant-ui/react";



export function Demo() {
    console.log("demo");
    const store = useToolUIsStore()
    console.log('store',store)
    return <>
    </>
}
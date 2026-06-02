"use client";

export default function App() {
    async function randomFunction() {
        await fetch("/:3000");
    }

    return (
        <div className="">
            <h1>Hey!</h1>
            <button type="button" onClick={randomFunction}>
                Click me
            </button>
        </div>
    );
}

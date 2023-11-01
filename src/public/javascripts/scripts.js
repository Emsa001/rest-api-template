const typeCode = (code, element, cooldown = 10) => {
    let i = 0;

    const addChar = () => {
        Prism.highlightElement(element);
        let char = code.charAt(i);

        element.innerHTML += `${char}`;
        if (i < code.length) {
            setTimeout(addChar, cooldown);
        }
        i++;
    };

    addChar();
};

var p = new Ping();

p.ping("https://google.com", function (err, apiPing) {
    if (err) {
        console.log("error loading resource");
        apiPing = apiPing + " " + err;
    }

    let element = document.getElementById("startProcess");
    element.parentElement.classList.remove("hidden");
    typeCode("loading...", element, 50);

    fetch("http://localhost:8888/api/status")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let element = document.getElementById("verifyProccess");
            element.parentElement.classList.remove("hidden");
            element.parentElement.classList.add("text-success");
            typeCode("done!", element, 50);

            return response.json();
        })
        .then((data) => {
            const code = `
{
    "success": true,
    "ping": "${apiPing}ms",
    "usage":
    {
        "cpu": "${data.cpuUsage}%",
        "memoryUsage": "${data.memoryUsage}%"
    }
}
            `;

            setTimeout(() => {
                let element = document.getElementById("codeElement");
                typeCode(code, element);
            }, 500);
        })
        .catch((error) => {
            let element = document.getElementById("verifyProccess");
            element.parentElement.classList.remove("hidden");
            element.parentElement.classList.add("text-error");
            typeCode("error!", element, 50);

            const code = `
{
    "success": false,
    "error": "${error}"  
}
                        `;

            setTimeout(() => {
                let element = document.getElementById("codeElement");
                typeCode(code, element);
            }, 500);
        });
});

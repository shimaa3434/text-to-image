
const icon_theme = document.querySelector('.icon-theme');
const generateBtn= document.getElementById("GenerateBtn")





// تغيير الثيم
icon_theme.addEventListener("click", () => {
    document.body.classList.toggle('dark-theme');
    icon_theme.src = document.body.classList.contains('dark-theme') ? "img/sun.svg" : "img/moon.svg";
});



// console.log(imgQuantity.value)

generateBtn.addEventListener("click",  async ()=>{
    let textInput = document.querySelector(".textInput").value
    const imgQuantity = document.querySelector('.img-quantity').value
    let images = document.querySelector(".images")
    
    // استدعاء الموديل باستخدام دالة fetch
    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
            {
                headers: {
                    Authorization: "Bearer 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",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({inputs: data}),
            }
        );
        
        const result = await response.blob();
        return result;
    }


    let promises = [];
    for (let i = 0; i < imgQuantity; i++) {
        promises.push(query(textInput));
    }

    Promise.all(promises).then((responses) => {
        images.innerHTML= ""
        responses.forEach((response, index) => {
            let imageUrl = URL.createObjectURL(response);
            images.innerHTML += `
                <div class="card" id="${index}">
                    <img src="${imageUrl}" alt="Generated Image ${index + 1}" width="250px">
                    <div class="icons">
                        <button class="download-btn" data-url="${imageUrl}" data-index="${index + 1}">
                            <img src="img/download.svg" alt="Download">
                        </button>
                    </div>
                </div>
            `;
            const downloadBtn= document.querySelectorAll(".download-btn")
            downloadBtn.forEach(dbtn =>{
                dbtn.addEventListener("click", (event)=>{
                    const url = event.currentTarget.getAttribute("data-url");
                    const index = event.currentTarget.getAttribute("data-index");
                    const link = document.createElement("a");
                        link.href = url;
                        link.download = `downloaded_${textInput}_${index}`;  // اسم الملف
                        link.click();
                })
            })
            textInput.value = "";
        });
        
    }).catch(error => {
        console.error("Error:", error);
    });
    
})


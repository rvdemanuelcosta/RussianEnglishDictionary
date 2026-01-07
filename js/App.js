const sb = document.getElementById("WordSearchField");
const cbAdjectives = document.getElementById("AdjectivesCheckbox");
const cbNouns = document.getElementById("NounsCheckbox");
const cbOthers = document.getElementById("OthersCheckbox");
const cbVerbs = document.getElementById("VerbsCheckbox");
const alertMessageContainer = document.getElementById("UserMessageContainer");
const userAlert = document.getElementById("UserAlertMessage");
const tableBody = document.getElementById("TableBody");
const wordNameElement = document.getElementById("WordName");
const wordTranslationElement = document.getElementById("en_tl");
const wordFormTypeElement = document.getElementById("form_type");
let QueryTimout = false;
const wordInfoWindow = document.getElementById("WordInfoWindow");
const wordInfoWindowCloseButton = document.getElementById("WordInfoWindowCloseBt");
const searchTypeSelector = document.getElementById("SearchType");
const askAIButton = document.getElementById("AskAIButton");
const aiOutput = document.getElementById("AIOutput");
const ollamaApi = "http://localhost:11434/api/generate";
const loadingSpiningElement = document.getElementById("loadingSpin");
const settingsCancelButton = document.getElementById("SettingsCancelButton");
const settingsDisplayLanguageSelect = document.getElementById("SettingsDisplayLanguageSelect");
const settingsAIModelSelect = document.getElementById("SettingsAIModelSelect");
const appTextElements = {
    MainHeader: document.getElementById("MainHeader"),
    UserInputLabel: document.getElementById("UserInputLabel").textContent
};
const appTextStrings = {
    English: {
        MainHeader: "Russian Dictionary"
    },
    Russian: {
        MainHeader: "Русский словарь"
    }
}

let displayLanguage;
let aiModel;
let aiModelNames = [
    "llama3.2:1b",
    "llama3:latest"
];
let aiModelInUse;
settingsCancelButton.addEventListener("click", ()=>{
    settingsWindow.classList.add("hidden");
    // reset ellements if necessary after clicking the cancel button
});
const settingsSaveButton = document.getElementById("SettingsSaveButton");
settingsSaveButton.addEventListener("click", ()=>{
    settingsWindow.classList.add("hidden");
    SaveAppSettings();
    // Save the settings here
});
const settingsWindow = document.getElementById("SettingsWindow");
const openSettingsButton = document.getElementById("OpenSettingsButton");
openSettingsButton.addEventListener("click", ()=>{
    settingsWindow.classList.remove("hidden");
});

// change default selected options for the settings
function UpdateSettingsSelectedItems(){
    Object.values(settingsAIModelSelect.children).forEach((option)=>{
        if(option.value == aiModel){
            option.selected = true;
        }
    });
    Object.values(settingsDisplayLanguageSelect.children).forEach((option)=>{
        if(option.value == displayLanguage){
            option.selected = true;
        }
    });
}

let generatingAiResponse = false;
askAIButton.addEventListener("click", ()=>{
    if(!generatingAiResponse){
        generatingAiResponse = true;
        // display a message to the user that the AI response is being generated.
        AskAI(wordNameElement.textContent);
        askAIButton.classList.add("hidden");
        loadingSpiningElement.classList.remove("hidden");

    }
    else{
        // show warning message here
    }
    
});
wordInfoWindowCloseButton.addEventListener("click", ()=>{
    wordInfoWindow.classList.add("hidden");
    askAIButton.classList.remove("hidden");
    
    aiOutput.innerHTML = "";
});

// Send user input only if enter key is pressed
sb.addEventListener('keyup', (e)=>{
    if(e.code == "Enter"){
        let searchtype = searchTypeSelector.value;
        if(!QueryTimout){
        QueryTimout = true;
        setTimeout(()=> {
            GetWord(sb.value, searchtype);
        QueryTimout = false;
    }, 500);
}
    else{
        console.log("Query timeout, wait 5 seconds.");
    }
    };
    
});

// Get AI generated data about the word chosen by the user.
async function AskAI(word){
  try{
    let askAISystemPrompt = "Respond with more information about the russian word provided, \
    stress, pronunciation, meaning, exemple of sentences in russian with translation. respond \
    in english, your response will be sent imediatly to a web site user that can not interact \
    with you, so do not include questions, suggestion of a new topic or anything that would require \
    the user interaction/response, also format the output to html, use html tags and not markdown when formating.";
    const response = await fetch(ollamaApi, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModelInUse,
        prompt: word,
        system: askAISystemPrompt,
        stream: false
      }),
    });
    if(!response.ok){
      console.log("error connecting to ollama API: ", response.statusText);
    }
    const ollamaOutput = await response.json();
    aiOutput.innerHTML = ollamaOutput.response;
    loadingSpiningElement.classList.add("hidden");
    generatingAiResponse = false;
  }
  catch (error){
    console.log("error connecting to ollama", error);
  }
}


// Main database request and response from the search bar
function GetWord(word, searchT){
    if(sb.value != "")
    {
        // fetch words and populate table
        tableBody.innerHTML = "";
        console.log("sending search type " + searchT);
        fetch(`http://127.0.0.1:8877/php/get_word.php?name=${word}&&searchtype=${searchT}`)
        .then(response => response.text())
        .then(html => {
        document.getElementById('TableBody').innerHTML = html;
        let qs = document.getElementsByClassName("bare");
        console.log(typeof(qs));
        Object.values(qs).forEach((element)=>{
            element.addEventListener("click", ()=>{
                console.log(element.textContent);
                fetch(`http://127.0.0.1:8877/php/get_translations.php?wordid=${element.id}`)
                .then(response => response.text())
                .then(html =>{
                    let childElements = element.children;
                    wordNameElement.textContent = childElements[0].textContent;
                    wordTranslationElement.textContent = html;
                    wordFormTypeElement.textContent = childElements[2].textContent;
                    wordInfoWindow.classList.remove("hidden");
                });
            });
        });
    })
        .catch(error => console.error('Error:', error));
        console.log(QueryTimout);
    }
    else{
        // Show some hints to the user
        userAlert.textContent = "Type at least 1 character to search on the database.";
            alertMessageContainer.classList.remove("hidden");
            alertMessageContainer.classList.add("showAlert");
            setTimeout(()=>{
                alertMessageContainer.classList.remove("showAlert");
                alertMessageContainer.classList.add("hideAlert");
                alertMessageContainer.style.setProperty("left", "-300px");
                setTimeout(()=>{
                alertMessageContainer.classList.add("hidden");
                alertMessageContainer.classList.remove("hideAlert");
                alertMessageContainer.style.setProperty("left", "calc(0% + 16px)");
            }, 1000);
            },5000);
    }
}
function SaveAppSettings(){
    localStorage.setItem("Language", settingsDisplayLanguageSelect.value);
    localStorage.setItem("AIModel", settingsAIModelSelect.value);
    LoadAppSettings();
}

function LoadAppSettings(){
    if(localStorage.getItem("Language")){
        displayLanguage = localStorage.getItem("Language");
    }
    else{
        displayLanguage = "English";
        localStorage.setItem("Language", displayLanguage);
    }
    if(localStorage.getItem("AIModel")){
        aiModel = localStorage.getItem("AIModel");
    }
    else{
        aiModel = "8B";
        localStorage.setItem("AIModel", aiModel);
    }
    UpdateAppLanguage();
    UpdateAIModel();
    UpdateSettingsSelectedItems();
}

function UpdateAppLanguage(){
    
    switch(displayLanguage){
        case "English":
            appTextElements.MainHeader.textContent = appTextStrings.English.MainHeader;
            console.log("Display language changed to " + displayLanguage);
        break;
        case "Русский":
            appTextElements.MainHeader.textContent = appTextStrings.Russian.MainHeader;
    }
}

function UpdateAIModel(){
    switch(aiModel){
        case "1B": aiModelInUse = aiModelNames[0];
        break;
        case "8B": aiModelInUse = aiModelNames[1];
    }
}

LoadAppSettings();





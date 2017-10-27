var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
  'hola cómo estás',
  'a dónde vas',
  'puedo llamarte mañana',
  'por qué hablaste cuando yo estaba hablando',
  'que tenga un buen día',
  'se venden paraguas'
]

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test en progreso';

  var phrase = phrases[randomPhrase()];
  phrasePara.textContent = phrase;
  resultPara.textContent = 'Correcto o Incorrecto?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = 'Mensaje de Diagnostico';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'es-AR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var speechResult = event.results[0][0].transcript;
    speechResult = speechResult.toLowerCase();
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    if(speechResult === phrase) {
      resultPara.textContent = 'Entendí perfecto!';
      resultPara.style.background = 'lime';
    } else {
      resultPara.textContent = 'Eso no es exactamente lo que escuché';
      resultPara.style.background = 'red';
    }
    console.log(speechResult);

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Empezar test';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Empezar test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}

testBtn.addEventListener('click', testSpeech);

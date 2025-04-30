let spanishWords = [];

// Función para cargar las palabras desde el archivo listado-general.txt
async function loadSpanishWords() {
  try {
    const response = await fetch('listado-general.txt');
    const text = await response.text();
    spanishWords = text.split(/\r?\n/).map(word => word.trim().toLowerCase());
  } catch (error) {
    console.error('Error al cargar las palabras:', error);
  }
}

// Llamar a la función para cargar las palabras al inicio
loadSpanishWords();

// Función para convertir texto a binario
document.getElementById("textToBinBtn").addEventListener("click", function() {
  var inputText = document.getElementById("inputText").value.trim().toLowerCase();
  if (containsNumbers(inputText)) {
    document.getElementById("validationMessage").textContent = "El texto no debe contener números.";
  } else {
    var binaryResult = textToBinary(inputText);
    document.getElementById("outputText").value = binaryResult;
    validateWord(inputText, document.getElementById("validationMessage"));
    performLexicalAnalysis(inputText);
  }
});

// Función para convertir binario a texto
document.getElementById("binToTextBtn").addEventListener("click", function() {
  var inputBinary = document.getElementById("inputBinary").value.trim();
  var textResult = binaryToText(inputBinary).toLowerCase();
  if (containsNumbers(textResult)) {
    document.getElementById("validationMessageBinary").textContent = "El texto no debe contener números.";
  } else {
    document.getElementById("outputBinary").value = textResult;
    validateWord(textResult, document.getElementById("validationMessageBinary"));
    performLexicalAnalysis(textResult);
  }
});

// Obtener referencia al botón de ayuda
var helpBtn = document.getElementById('helpBtn');

// Agregar un evento de clic al botón de ayuda
helpBtn.addEventListener('click', function() {
  // Mostrar la ventana modal
  showModal('ayuda.jpg');
});

// Función para mostrar la ventana modal con la imagen
function showModal(imagePath) {
  // Crear elemento de imagen
  var img = document.createElement('img');
  img.src = imagePath;

  // Crear contenedor de la ventana modal
  var modal = document.createElement('div');
  modal.classList.add('modal');

  // Agregar la imagen al contenedor modal
  modal.appendChild(img);

  // Agregar la ventana modal al cuerpo del documento
  document.body.appendChild(modal);

  // Agregar evento de clic al contenedor modal para cerrarlo al hacer clic fuera de él
  modal.addEventListener('click', function() {
    document.body.removeChild(modal);
  });
}

// Función para convertir texto a binario
function textToBinary(text) {
  return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

// Función para convertir binario a texto
function binaryToText(binary) {
  return binary.split(' ').map(char => String.fromCharCode(parseInt(char, 2))).join('');
}

// Función para validar si una palabra existe en español usando la lista cargada
function validateWord(word, validationMessage) {
  const words = word.split(/\s+/).map(w => w.toLowerCase().trim());
  console.log('Palabras ingresadas:', words);
  
  const invalidWords = words.filter(w => !spanishWords.includes(w));
  console.log('Palabras inválidas:', invalidWords);
  
  if (invalidWords.length > 0) {
    validationMessage.textContent = `La(s) siguiente(s) palabra(s) no es(son) válidas: "${invalidWords.join(', ')}", para más información da clic en la parte superior derecha en "Palabras Admitidas"`;
  } else {
    validationMessage.textContent = "La(s) palabra(s) es(son) admitidas";
  }
  performSyntacticAnalysis(word, invalidWords);
}

// Función para verificar si una cadena contiene números
function containsNumbers(str) {
  return /\d/.test(str);
}

// Obtener referencia al botón de palabras admitidas
const wordListBtn = document.getElementById('wordListBtn');

// Agregar un evento de clic al botón de palabras admitidas
wordListBtn.addEventListener('click', function() {
  // Abrir el archivo de texto con las palabras admitidas
  window.open('listado-general.txt', '_blank');
});

// Función para realizar el análisis léxico
function performLexicalAnalysis(text) {
  const words = text.split(/\s+/);
  const analysis = words.map(word => `Palabra: ${word} - Longitud: ${word.length}`).join('\n');
  const codeSnippet = `
// Función para realizar el análisis léxico
function performLexicalAnalysis(text) {
  const words = ${JSON.stringify(words)};
  const analysis = words.map(word => \`Palabra: \${word} - Longitud: \${word.length}\`).join('\\n');
  document.getElementById('lexicalAnalysis').textContent = analysis;
}
performLexicalAnalysis("${text}");
`;
  document.getElementById('lexicalAnalysis').textContent = analysis;
  document.getElementById('lexicalAnalysisCode').textContent = codeSnippet;
}

// Función para realizar el análisis sintáctico
function performSyntacticAnalysis(word, invalidWords) {
  let analysis = `Palabra(s) ingresada(s): ${word}\n`;
  if (invalidWords.length > 0) {
    analysis += `Palabra(s) no válida(s): ${invalidWords.join(', ')}\n`;
  } else {
    analysis += `Todas las palabras son válidas\n`;
  }
  const codeSnippet = `
// Función para realizar el análisis sintáctico
function performSyntacticAnalysis(word, invalidWords) {
  let analysis = \`Palabra(s) ingresada(s): \${word}\\n\`;
  if (invalidWords.length > 0) {
    analysis += \`Palabra(s) no válida(s): \${invalidWords.join(', ')}\\n\`;
  } else {
    analysis += 'Todas las palabras son válidas\\n';
  }
  document.getElementById('syntacticAnalysis').textContent = analysis;
}
performSyntacticAnalysis("${word}", ${JSON.stringify(invalidWords)});
`;
  document.getElementById('syntacticAnalysis').textContent = analysis;
  document.getElementById('syntacticAnalysisCode').textContent = codeSnippet;
}

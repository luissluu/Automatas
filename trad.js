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

// Inicializar la interfaz cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar el contenedor de análisis como oculto
  const analysisWrapper = document.getElementById('analysisWrapper');
  if (analysisWrapper) {
    analysisWrapper.style.maxHeight = '0px';
  }
});

// Función para convertir texto a binario
document.getElementById("textToBinBtn").addEventListener("click", function() {
  var inputText = document.getElementById("inputText").value.trim().toLowerCase();
  if (containsNumbers(inputText)) {
    document.getElementById("validationMessage").textContent = "El texto no debe contener números.";
    document.getElementById("validationMessage").className = "invalid";
  } else {
    var binaryResult = textToBinary(inputText);
    document.getElementById("outputText").value = binaryResult;
    validateWord(inputText, document.getElementById("validationMessage"));
    performLexicalAnalysis(inputText);
    performSemanticAnalysis(inputText);
  }
});

// Función para convertir binario a texto
document.getElementById("binToTextBtn").addEventListener("click", function() {
  var inputBinary = document.getElementById("inputBinary").value.trim();
  // Primero verificamos si es un binario válido
  if (!isValidBinary(inputBinary)) {
    document.getElementById("validationMessageBinary").textContent = "El formato binario no es válido. Debe contener solo 0s y 1s separados por espacios.";
    document.getElementById("validationMessageBinary").className = "invalid";
    return;
  }
  
  try {
    var textResult = binaryToText(inputBinary).toLowerCase();
    if (containsNumbers(textResult)) {
      document.getElementById("validationMessageBinary").textContent = "El texto resultante no debe contener números.";
      document.getElementById("validationMessageBinary").className = "invalid";
    } else {
      document.getElementById("outputBinary").value = textResult;
      validateWord(textResult, document.getElementById("validationMessageBinary"));
      performLexicalAnalysis(textResult);
      performSemanticAnalysis(textResult);
    }
  } catch (error) {
    console.error("Error al convertir:", error);
    document.getElementById("validationMessageBinary").textContent = "Error al procesar el código binario.";
    document.getElementById("validationMessageBinary").className = "invalid";
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

// Función para verificar si un texto binario es válido
function isValidBinary(binary) {
  return /^[01\s]+$/.test(binary);
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
  
  const invalidWords = words.filter(w => w.length > 0 && !spanishWords.includes(w));
  console.log('Palabras inválidas:', invalidWords);
  
  if (invalidWords.length > 0) {
    validationMessage.textContent = `La(s) siguiente(s) palabra(s) no es(son) válidas: "${invalidWords.join(', ')}", para más información da clic en la parte superior derecha en "Palabras Admitidas"`;
    validationMessage.className = "invalid";
  } else {
    validationMessage.textContent = "La(s) palabra(s) es(son) admitidas";
    validationMessage.className = "valid";
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

// Función para realizar el análisis semántico
function performSemanticAnalysis(text) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // Información semántica: clasificamos palabras por categorías comunes
  // Esto es un ejemplo simple, idealmente se usaría una base de datos lingüística
  
  // Lista de palabras comunes de diferentes categorías
  const categories = {
    saludos: ['hola', 'adios', 'buenos', 'buenas', 'saludos', 'bienvenido', 'bienvenida'],
    tiempo: ['hoy', 'ayer', 'mañana', 'tarde', 'noche', 'día', 'semana', 'mes', 'año', 'hora', 'minuto'],
    personas: ['persona', 'hombre', 'mujer', 'niño', 'niña', 'amigo', 'amiga', 'familia', 'padre', 'madre'],
    verbos: ['ser', 'estar', 'hacer', 'tener', 'ir', 'venir', 'decir', 'hablar', 'pensar', 'comer', 'beber'],
    adjetivos: ['bueno', 'malo', 'grande', 'pequeño', 'alto', 'bajo', 'rápido', 'lento', 'bonito', 'feo'],
    conjunciones: ['y', 'o', 'pero', 'porque', 'aunque', 'sin', 'con', 'como', 'si', 'cuando', 'que'],
    lugares: ['casa', 'escuela', 'trabajo', 'parque', 'ciudad', 'país', 'calle', 'plaza', 'tienda', 'mercado']
  };
  
  // Clasificar palabras por categoría
  const classifiedWords = {};
  
  // Inicializar categorías vacías
  Object.keys(categories).forEach(category => {
    classifiedWords[category] = [];
  });
  
  // Clasificar cada palabra
  words.forEach(word => {
    let categorized = false;
    
    Object.keys(categories).forEach(category => {
      if (categories[category].includes(word)) {
        classifiedWords[category].push(word);
        categorized = true;
      }
    });
    
    // Si no se clasificó, agregar a "otros"
    if (!categorized && !classifiedWords['otros']) {
      classifiedWords['otros'] = [word];
    } else if (!categorized) {
      classifiedWords['otros'].push(word);
    }
  });
  
  // Generar análisis
  let analysis = 'Análisis semántico del texto:\n';
  
  // Resumen general
  analysis += `Total de palabras: ${words.length}\n\n`;
  
  // Análisis por categorías
  Object.keys(classifiedWords).forEach(category => {
    if (classifiedWords[category].length > 0) {
      analysis += `- ${category.charAt(0).toUpperCase() + category.slice(1)}: ${classifiedWords[category].join(', ')}\n`;
    }
  });
  
  // Análisis de contexto (ejemplo simplificado)
  analysis += '\nPosible contexto: ';
  
  if (classifiedWords['saludos'].length > 0) {
    analysis += 'Mensaje de saludo/conversacional. ';
  }
  
  if (classifiedWords['tiempo'].length > 0) {
    analysis += 'Referencia temporal. ';
  }
  
  if (classifiedWords['lugares'].length > 0) {
    analysis += 'Referencia a ubicaciones. ';
  }
  
  // Si no hay suficientes palabras clasificadas, no podemos determinar el contexto
  if (Object.values(classifiedWords).flat().length < words.length * 0.2) {
    analysis += 'Insuficientes palabras reconocidas para determinar contexto.';
  }
  
  // Generar el fragmento de código para mostrar
  const codeSnippet = `
// Función para realizar el análisis semántico
function performSemanticAnalysis(text) {
  const words = ${JSON.stringify(words)};
  
  // Clasificar palabras por categorías semánticas
  const categories = ${JSON.stringify(categories, null, 2)};
  
  // Clasificar las palabras
  const classifiedWords = ${JSON.stringify(classifiedWords, null, 2)};
  
  // Analizar el texto por categorías y determinar posible contexto
  // ...
  
  document.getElementById('semanticAnalysis').textContent = 'Análisis semántico completo';
}
performSemanticAnalysis("${text}");
`;
  
  document.getElementById('semanticAnalysis').textContent = analysis;
  document.getElementById('semanticAnalysisCode').textContent = codeSnippet;
}

// Funcionalidad para las pestañas
document.getElementById('textToBinaryTab').addEventListener('click', function() {
  setActiveTab('textToBinaryTab', 'textToBinaryContent');
});

document.getElementById('binaryToTextTab').addEventListener('click', function() {
  setActiveTab('binaryToTextTab', 'binaryToTextContent');
});

function setActiveTab(tabId, contentId) {
  // Desactivar todas las pestañas
  document.querySelectorAll('.switch-option').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Desactivar todos los contenidos
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Activar la pestaña seleccionada
  document.getElementById(tabId).classList.add('active');
  
  // Activar el contenido seleccionado
  document.getElementById(contentId).classList.add('active');
}

// Funcionalidad para mostrar/ocultar análisis
document.getElementById('toggleAnalysisBtn').addEventListener('click', function() {
  const wrapper = document.getElementById('analysisWrapper');
  const toggleBtn = document.getElementById('toggleAnalysisBtn').querySelector('i');
  const toggleText = document.getElementById('toggleAnalysisBtn').querySelector('span');
  
  if (wrapper.classList.contains('open')) {
    wrapper.classList.remove('open');
    wrapper.style.maxHeight = '0px';
    toggleBtn.classList.remove('fa-chevron-up');
    toggleBtn.classList.add('fa-chevron-down');
    toggleText.textContent = 'Ver análisis';
  } else {
    wrapper.classList.add('open');
    wrapper.style.maxHeight = '2000px';
    toggleBtn.classList.remove('fa-chevron-down');
    toggleBtn.classList.add('fa-chevron-up');
    toggleText.textContent = 'Ocultar análisis';
  }
});
// Utilidad: obtener valores seleccionados
function getSelectedGroups() {
  const checks = document.querySelectorAll(".group-check:checked");
  const values = [...checks].map(ch => ch.value);
  if (values.length === 0) return null;

  const mapGrupos = {
    "1": { es: "grupo 1, filas 1 a 8", en: "Group 1, rows 1 to 8", pt: "grupo 1, fileiras de 1 a 8" },
    "2": { es: "grupo 2, filas 9 a 16", en: "Group 2, rows 9 to 16", pt: "grupo 2, fileiras de 9 a 16" },
    "3": { es: "grupo 3, filas 17 a 24", en: "Group 3, rows 17 to 24", pt: "grupo 3, fileiras de 17 a 24" },
    "4": { es: "grupo 4, filas 25 a 32", en: "Group 4, rows 25 to 32", pt: "grupo 4, fileiras de 25 a 32" }
  };

  return {
    es: values.map(v => mapGrupos[v].es).join(", "),
    en: values.map(v => mapGrupos[v].en).join(", "),
    pt: values.map(v => mapGrupos[v].pt).join(", ")
  };
}

// Lógica de cambio de puerta
function getGateText(lang, gate, secondaryGate) {
  if (!gate && !secondaryGate) return "";

  // Si no hay puerta secundaria, solo se menciona la principal
  if (!secondaryGate) {
    if (lang === "es") return `por la puerta ${gate}`;
    if (lang === "en") return `through gate ${gate}`;
    if (lang === "pt") return `pelo portão ${gate}`;
  }

  // Si hay cambio de puerta
  if (secondaryGate) {
    if (lang === "es") {
      return `por la puerta ${secondaryGate}. Se informa el cambio de puerta: el embarque se realizará por la puerta ${secondaryGate} en lugar de la puerta ${gate}.`;
    }
    if (lang === "en") {
      return `through gate ${secondaryGate}. Please note the gate change: boarding will take place at gate ${secondaryGate} instead of gate ${gate}.`;
    }
    if (lang === "pt") {
      return `pelo portão ${secondaryGate}. Informamos a alteração de portão: o embarque será realizado pelo portão ${secondaryGate} em vez do portão ${gate}.`;
    }
  }
}

// Plantillas por idioma
function buildAnnouncement(lang, template, data) {
  const { vuelo, destino, gate, secondaryGate, grupos } = data;

  const gateText = getGateText(lang, gate, secondaryGate) || "";

  // Helper para concatenar gateText con frases
  const gateSentence = gateText ? " " + gateText : "";

  // Para texto según idioma
  const groupsText = grupos ? grupos[lang] : null;

  if (template === "texto-libre") {
    // Se usa tal cual el texto libre
    return data.freeText || "";
  }

  if (lang === "es") {
    switch (template) {
      case "pre-embarque":
        return `Su atención por favor, el vuelo ${vuelo} operado por Flybondi comenzará en breves minutos su embarque ${gateSentence}. ` +
               `Solicitamos mantenerse cerca de la puerta de embarque. ` +
               `Solicitamos tener a bien en mano documento o pasaporte junto a la tarjeta de embarque impresa o digital en su dispositivo móvil con el brillo al máximo. Muchas gracias.`;

      case "inicio-embarque":
        return `Su atención por favor, Flybondi comienza el embarque del vuelo número ${vuelo} con destino a ${destino} ${gateSentence}. ` +
               `A partir de este momento invitamos a familias con menores de 5 años y personas embarazadas` +
               (groupsText ? `, y a los pasajeros de ${groupsText}` : ``) +
               `. Recordamos tener en todo momento documento o pasaporte y la tarjeta de embarque impresa o digital con el brillo al máximo en el dispositivo.`;

      case "llamada-grupos":
        return `Su atención por favor, continuamos con el embarque del vuelo ${vuelo} con destino a ${destino}. ` +
               (groupsText
                 ? `Invitamos a embarcar a los pasajeros de ${groupsText}. `
                 : `Este anuncio está configurado como llamada por grupos, pero no se han seleccionado grupos.`) +
               `Les recordamos tener preparado documento o pasaporte y tarjeta de embarque.`;

      case "ultimo-aviso":
        return `Su atención por favor, se informa el último anuncio de embarque para el vuelo ${vuelo} con destino a ${destino} operado por Flybondi ${gateSentence}. ` +
               `Solicitamos a los pasajeros faltantes acercarse a la puerta urgentemente; en caso contrario, su equipaje será removido de la aeronave.`;

      case "demora":
        return `Su atención por favor, se informa a los pasajeros que el vuelo ${vuelo} con destino a ${destino} se encuentra demorado por cuestiones operacionales. ` +
               `Se solicita mantenerse en las cercanías de la puerta. Muchas gracias.`;

      case "cancelacion":
        return `Su atención por favor, se informa a los pasajeros que el vuelo ${vuelo} con destino a ${destino} se encuentra cancelado por cuestiones técnicas u operativas. ` +
               (gate ? `Se solicita a los pasajeros mantenerse cerca de la puerta ${gate}.` : ``);

      case "condicional":
        return `Su atención por favor, se informa a los pasajeros que el vuelo ${vuelo} con destino a ${destino} operado por Flybondi se encuentra condicionado por motivos meteorológicos en destino. Muchas gracias.`;

      default:
        return "";
    }
  }

  if (lang === "en") {
    switch (template) {
      case "pre-embarque":
        return `Your attention please. Flight ${vuelo}, operated by Flybondi, will soon begin boarding${gateSentence}. ` +
               `We kindly ask you to remain near the boarding gate. ` +
               `Please have your ID or passport and your printed or mobile boarding pass ready, with your device screen brightness set to maximum. Thank you.`;

      case "inicio-embarque":
        return `Your attention please. Flybondi is now starting the boarding process for flight ${vuelo} to ${destino}${gateSentence}. ` +
               `We now invite families with children under 5 years old and pregnant passengers` +
               (groupsText ? `, as well as passengers in ${groupsText}` : ``) +
               ` to board. Please keep your ID or passport and boarding pass ready, printed or on your mobile device with maximum screen brightness.`;

      case "llamada-grupos":
        return `Your attention please. We are continuing the boarding of flight ${vuelo} to ${destino}. ` +
               (groupsText
                 ? `We now invite passengers in ${groupsText} to board. `
                 : `This is a group boarding call, but no groups have been selected.`) +
               `Please have your ID or passport and boarding pass ready.`;

      case "ultimo-aviso":
        return `Your attention please. This is the final boarding call for flight ${vuelo} to ${destino}, operated by Flybondi${gateSentence}. ` +
               `We kindly ask the remaining passengers to proceed to the gate immediately. Otherwise, their baggage will be removed from the aircraft.`;

      case "demora":
        return `Your attention please. We inform passengers that flight ${vuelo} to ${destino} is delayed due to operational reasons. ` +
               `Please remain near the gate. Thank you.`;

      case "cancelacion":
        return `Your attention please. We inform passengers that flight ${vuelo} to ${destino} has been cancelled due to technical or operational reasons. ` +
               (gate ? `Passengers are requested to remain near gate ${gate}.` : ``);

      case "condicional":
        return `Your attention please. We inform passengers that flight ${vuelo} to ${destino}, operated by Flybondi, is subject to weather conditions at destination. Thank you.`;

      default:
        return "";
    }
  }

  if (lang === "pt") {
    switch (template) {
      case "pre-embarque":
        return `Senhoras e senhores passageiros, informamos que o voo ${vuelo}, operado pela Flybondi, iniciará o embarque em poucos minutos${gateSentence}. ` +
               `Pedimos que permaneçam próximos ao portão de embarque. ` +
               `Solicitamos que mantenham em mãos o documento de identidade ou passaporte e o cartão de embarque impresso ou em seu dispositivo móvel, com o brilho da tela no máximo. Muito obrigado.`;

      case "inicio-embarque":
        return `Senhoras e senhores, a Flybondi informa o início do embarque do voo ${vuelo} com destino a ${destino}${gateSentence}. ` +
               `Convidamos neste momento as famílias com crianças menores de 5 anos e as passageiras grávidas` +
               (groupsText ? `, assim como os passageiros do ${groupsText}` : ``) +
               ` a embarcar. Lembramos que é necessário manter o documento de identidade ou passaporte e o cartão de embarque impresso ou em seu dispositivo móvel com o brilho no máximo.`;

      case "llamada-grupos":
        return `Senhoras e senhores, seguimos com o embarque do voo ${vuelo} com destino a ${destino}. ` +
               (groupsText
                 ? `Convidamos agora os passageiros do ${groupsText} para embarcar. `
                 : `Este anúncio é para embarque por grupos, porém nenhum grupo foi selecionado.`) +
               `Lembramos que devem manter em mãos o documento de identidade ou passaporte e o cartão de embarque.`;

      case "ultimo-aviso":
        return `Senhoras e senhores, este é o último chamado para o embarque do voo ${vuelo} com destino a ${destino}, operado pela Flybondi${gateSentence}. ` +
               `Solicitamos que os passageiros restantes dirijam-se imediatamente ao portão; caso contrário, sua bagagem será retirada da aeronave.`;

      case "demora":
        return `Senhoras e senhores, informamos que o voo ${vuelo} com destino a ${destino} está atrasado por motivos operacionais. ` +
               `Pedimos que permaneçam nas proximidades do portão. Muito obrigado.`;

      case "cancelacion":
        return `Senhoras e senhores, informamos que o voo ${vuelo} com destino a ${destino} foi cancelado por motivos técnicos ou operacionais. ` +
               (gate ? `Pedimos que permaneçam próximos ao portão ${gate}.` : ``);

      case "condicional":
        return `Senhoras e senhores, informamos que o voo ${vuelo} com destino a ${destino}, operado pela Flybondi, está condicionado às condições meteorológicas no destino. Muito obrigado.`;

      default:
        return "";
    }
  }

  return "";
}

// Actualizar visibilidad de "texto libre"
function updateFreeTextVisibility() {
  const template = document.getElementById("template").value;
  const container = document.getElementById("freeTextContainer");
  container.style.display = template === "texto-libre" ? "block" : "none";
}

// Generar texto en los idiomas seleccionados
function generateText() {
  const vuelo = document.getElementById("flightNumber").value.trim() || "XXXX";
  const destino = document.getElementById("destination").value || "su destino";
  const gate = document.getElementById("gate").value;
  const secondaryGate = document.getElementById("secondaryGate").value.trim();
  const template = document.getElementById("template").value;
  const grupos = getSelectedGroups();
  const freeText = document.getElementById("freeText").value.trim();

  const langEs = document.getElementById("langEs").checked;
  const langEn = document.getElementById("langEn").checked;
  const langPt = document.getElementById("langPt").checked;

  const data = { vuelo, destino, gate, secondaryGate, grupos, freeText };

  const esText = langEs ? buildAnnouncement("es", template, data) : "";
  const enText = langEn ? buildAnnouncement("en", template, data) : "";
  const ptText = langPt ? buildAnnouncement("pt", template, data) : "";

  document.getElementById("outputEs").value = esText;
  document.getElementById("outputEn").value = enText;
  document.getElementById("outputPt").value = ptText;
}

// --- Text to Speech ---

let voices = [];

function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}

// Elegir voz según idioma y género solicitado
function pickVoice(langCode, gender) {
  if (!voices || voices.length === 0) return null;

  const langPrefix = langCode + "-"; // "es-", "en-", "pt-"

  // Filtrar por idioma
  let filtered = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));

  if (filtered.length === 0) {
    // Si no hay exacto, intentar idioma genérico
    filtered = voices.filter(v => v.lang.toLowerCase().startsWith(langCode));
  }

  if (filtered.length === 0) return null;

  if (gender === "female") {
    const fem = filtered.find(v =>
      /female|woman|mujer|femin/i.test(v.name)
    );
    if (fem) return fem;
  }

  if (gender === "male") {
    const male = filtered.find(v =>
      /male|man|hombre|masc/i.test(v.name)
    );
    if (male) return male;
  }

  // Si no se encontró por género, devuelve la primera
  return filtered[0];
}

function speakCurrent() {
  const rate = parseFloat(document.getElementById("rate").value);
  const pitch = parseFloat(document.getElementById("pitch").value);
  const volume = parseFloat(document.getElementById("volume").value);
  const voiceLang = document.getElementById("voiceLang").value; // es/en/pt
  const voiceGender = document.getElementById("voiceGender").value; // any/male/female

  let text = "";
  if (voiceLang === "es") text = document.getElementById("outputEs").value;
  if (voiceLang === "en") text = document.getElementById("outputEn").value;
  if (voiceLang === "pt") text = document.getElementById("outputPt").value;

  if (!text) {
    alert("No hay texto generado en el idioma seleccionado.");
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert("Text-to-Speech no está soportado en este navegador.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  const voice = pickVoice(voiceLang, voiceGender);
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Actualizar valores visuales de sliders
function updateSliderLabels() {
  document.getElementById("rateValue").textContent =
    parseFloat(document.getElementById("rate").value).toFixed(1);
  document.getElementById("pitchValue").textContent =
    parseFloat(document.getElementById("pitch").value).toFixed(1);
  document.getElementById("volumeValue").textContent =
    parseFloat(document.getElementById("volume").value).toFixed(1);
}

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Plantilla
  document.getElementById("template").addEventListener("change", updateFreeTextVisibility);

  // Botones
  document.getElementById("generateBtn").addEventListener("click", generateText);
  document.getElementById("speakBtn").addEventListener("click", speakCurrent);

  // Sliders
  ["rate", "pitch", "volume"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateSliderLabels);
  });
  updateSliderLabels();

  // TTS: cargar voces
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    console.warn("speechSynthesis no soportado");
  }

  // Mostrar texto libre si ya está seleccionada esa plantilla
  updateFreeTextVisibility();
});

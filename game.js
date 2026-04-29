let prestige = 50;
let ethics = 50;
let currentScene = 1;

function startGame() {
    document.getElementById('titleScene').classList.remove('active');
    document.getElementById('statsBar').style.display = 'flex';
    showScene(1);
}

function showScene(num) {
    currentScene = num;
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(`scene${num}`).classList.add('active');
    updateStats();
}

function updateStats() {
    document.getElementById('prestigeValue').textContent = prestige;
    document.getElementById('ethicsValue').textContent = ethics;
    
    prestige = Math.max(0, Math.min(100, prestige));
    ethics = Math.max(0, Math.min(100, ethics));
}

function makeChoice(scene, choice, prestigeChange, ethicsChange) {
    const consequences = {
        1: {
            basic: "Has elegido un camino más seguro. Investigas embriones que nunca nacerán, lo cual genera conocimiento valioso pero poco reconocimiento inmediato.",
            clinical: "Te lanzas a la aplicación clínica. El riesgo es mayor, pero las potenciales recompensas científicas y sociales son enormes."
        },
        2: {
            rare: "Seleccionas una enfermedad rara. Es éticamente más sólida, pero atrae menos atención mediática.",
            ccr5: "Eliges CCR5 para el VIH. El objetivo tiene sentido médico, pero también es más controvertido y visible."
        },
        3: {
            technical: "Explicas todo en detalle técnico. Algunas parejas optan por no participar, pero las que lo hacen comprenden los riesgos.",
            simplified: "Simplificas la explicación. Más familias se apuntan, pero con menor comprensión de los riesgos."
        },
        4: {
            formal: "Sigues el proceso oficial. Es más lento, pero tienes el respaldo institucional.",
            internal: "Tomas atajos. El proyecto avanza más rápido, pero sin el paraguas de la aprobación formal."
        },
        5: {
            reset: "Descartas los embriones con mosaicismo. Es la decisión más segura, pero pierdes tiempo valioso.",
            continue: "Continúas con la implantación a pesar de los resultados mixtos. Asumes riesgos desconocidos por el avance científico."
        },
        6: {
            academic: "Publicas en revistas académicas. Tardará meses en revisarse, pero será validación científica legítima.",
            youtube: "Anuncias en YouTube. El mundo se entera inmediatamente, pero sin validación científica formal."
        },
        7: {
            admit: "Reconoces errores. La comunidad científica respeta tu honestidad, aunque cuestionan tus métodos.",
            defend: "Defiendes tu trabajo. Mantienes tu posición, pero el conflicto con la comunidad científica se intensifica."
        }
    };

    const sceneEl = document.getElementById(`scene${scene}`);
    let consequenceEl = sceneEl.querySelector('.consequence');
    
    if (!consequenceEl) {
        consequenceEl = document.createElement('div');
        consequenceEl.className = 'consequence';
        sceneEl.querySelector('.decisions').after(consequenceEl);
    }
    
    consequenceEl.innerHTML = `
        <h4>Consecuencia</h4>
        <p>${consequences[scene][choice]}</p>
    `;

    prestige += prestigeChange;
    ethics += ethicsChange;
    updateStats();

    setTimeout(() => {
        if (scene < 7) {
            showScene(scene + 1);
        } else {
            showEnding();
        }
    }, 2500);
}

function showEnding() {
    document.getElementById('statsBar').style.display = 'none';
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById('endingScene').classList.add('active');
    document.getElementById('finalPrestige').textContent = prestige;
    document.getElementById('finalEthics').textContent = ethics;

    let description = "";
    
    if (prestige >= 70 && ethics >= 70) {
        description = "Has logrado un equilibrio notable: alto prestigio científico junto con integridad ética. Tu trabajo, aunque controvertido, fue reconocido por su rigor y transparencia. La historia recuerda tu caso como un ejemplo de cómo navegar los límites de la ciencia con responsabilidad.";
    } else if (prestige >= 70 && ethics < 30) {
        description = "Alcanzaste el estrellato científico, pero a un costo ético enorme. Tu caso se estudia hoy como ejemplo de los peligros de priorizar el reconocimiento sobre la seguridad. Fuiste etiquetado como el 'científico loco', perpetuando exactamente el estereotipo que el juego buscaba cuestionar.";
    } else if (prestige < 30 && ethics >= 70) {
        description = "Mantuviste tu integridad ética, pero el mundo apenas conoció tu nombre. Tu investigación fue valiosa pero no transformadora. Quizás fue lo correcto, pero el debate sobre edición genética en humanos sigue sin beneficiarse de tu experiencia.";
    } else if (prestige < 30 && ethics < 30) {
        description = "El resultado más desafortunado: ni prestigio ni integridad. Tu caso fue un desastre mediático que dañó tu reputación y la discusión sobre edición genética. La lección es clara: sin ética ni visibilidad, el impacto se pierde.";
    } else if (prestige > ethics) {
        description = "Elegiste el camino del reconocimiento sobre la rectitud. Lograste visibilidad, pero a costa de tu integridad. La historia te recuerda más por tus métodos que por tus contribuciones.";
    } else {
        description = "Priorizaste la ética sobre la gloria. Tu nombre no resonó en los medios, pero dormiste tranquilo sabiendo que priorizaste la seguridad sobre la ambición.";
    }

    document.getElementById('endingDescription').textContent = description;
}

function restartGame() {
    prestige = 50;
    ethics = 50;
    currentScene = 1;
    
    document.querySelectorAll('.consequence').forEach(el => el.remove());
    document.getElementById('endingScene').classList.remove('active');
    document.getElementById('titleScene').classList.add('active');
    document.getElementById('statsBar').style.display = 'none';
}
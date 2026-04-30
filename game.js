let prestige = 0;
let ethics = 0;
let currentScene = 1;
let choiceMade = false;
let canContinue = false;
let currentSceneNotifications = [];

const notificationsData = {
    1: [
        { type: 'pressure', header: 'Inicio del Proyecto', content: 'El CRISPR-Cas9 está listo para editar genomas humanos. Sea el primero en China.', source: 'Reporte interno SUSTech - 2016' },
        { type: 'support', header: 'Recursos Aprobados', content: 'El laboratorio cuenta con respaldo total. Tiene 5 millones de yuanes para investigación.', source: 'Oficina de investigación, Nov 2016' }
    ],
    2: [
        { type: 'pressure', header: 'Competencia Científica', content: 'El MIT desarrolla técnica CRISPR para edición de embriones humanos.', source: 'MIT Technology Review - Dic 2016' },
        { type: 'support', header: 'Apoyo Institucional', content: 'El laboratorio cuenta con respaldo total de SUSTech. Sea pionero en China.', source: 'Comunicado interno, Nov 2016' }
    ],
    3: [
        { type: 'pressure', header: 'Competencia Internacional', content: 'Reino Unido aprueba primeros experimentos con embriones humanos CRISPR.', source: 'BBC - Febrero 2017' },
        { type: 'support', header: 'Apoyo Local', content: 'El gen CCR5 es ideal: el beneficio es claro para familias con VIH.', source: 'Dr. Liu, colaborador' }
    ],
    4: [
        { type: 'pressure', header: 'Urgencia', content: 'El Karolinska Institutet inicia ensayos con parejas europeas. ¡El tiempo corre!', source: 'Nature - Marzo 2017' },
        { type: 'support', header: 'Testimonio', content: 'Gracias Dr. He. Nuestra familia nunca tuvo otra esperanza.', source: 'Familia Zhang (paciente)' }
    ],
    5: [
        { type: 'pressure', header: 'Alerta', content: 'El hospital de Shenzhen pregunta sobre procedimientos éticos. Sea cauteloso.', source: 'Memo interno - 2017' },
        { type: 'support', header: 'Facilitación', content: 'El proceso ético puede simplificarse. Nosotros apoyamos su proyecto.', source: 'Funcionario provincial' }
    ],
    6: [
        { type: 'pressure', header: 'Mosaicismo Detectado', content: 'Solo el 50% de las células fueron editadas correctamente. Riesgo incierto.', source: 'Datos del laboratorio - Julio 2018' },
        { type: 'support', header: 'Apoyo Científico', content: 'El mosaicismo ocurre en muchos procedimientos. Las tasas de éxito mejorarán.', source: 'Dr. Chen, genetista' }
    ],
    7: [
        { type: 'pressure', header: 'Nacimiento Exitoso', content: '¡Las gemelas Lulu y Nana nacieron saludables! Ahora debe comunicarse al mundo.', source: 'Equipo del laboratorio - Nov 2018' },
        { type: 'support', header: 'Urgencia de Comunicación', content: 'La cumbre de Edit World en Hong Kong es en semanas. Sea el primero.', source: 'Consejero de comunicaciones' }
    ]
};

function showNotification(notif) {
    const container = document.getElementById('notifications');
    const el = document.createElement('div');
    el.className = `notification ${notif.type}`;
    el.dataset.scene = currentScene;
    el.innerHTML = `
        <div class="notification-header">
            <span>${notif.header}</span>
        </div>
        <div class="notification-content">${notif.content}</div>
        <div class="notification-source">${notif.source}</div>
        <button class="notification-dismiss" onclick="dismissNotification(this.parentElement)">×</button>
    `;
    container.appendChild(el);
}

function dismissNotification(el) {
    el.classList.add('fading');
    setTimeout(() => {
        el.remove();
        updateInboxIndicator();
    }, 400);
}

function updateInboxIndicator() {
    const container = document.getElementById('notifications');
    const remaining = container.querySelectorAll(`.notification:not(.fading)[data-scene="${currentScene}"]`).length;
    const indicator = document.getElementById('inboxIndicator');
    const countEl = document.getElementById('inboxCount');
    
    if (remaining > 0) {
        indicator.classList.add('show');
        countEl.textContent = `${remaining} mensaje${remaining > 1 ? 's' : ''} pendientes`;
    } else {
        indicator.classList.remove('show');
    }
}

function showAllNotifications() {
    const container = document.getElementById('notifications');
    const all = container.querySelectorAll(`.notification[data-scene="${currentScene}"]`);
    all.forEach(el => {
        el.classList.remove('fading');
        el.style.animation = 'slideInRight 0.3s ease';
    });
    document.getElementById('inboxIndicator').classList.remove('show');
}

function showSceneNotifications(num) {
    currentSceneNotifications = notificationsData[num] || [];
    currentSceneNotifications.forEach((notif, i) => {
        setTimeout(() => {
            showNotification(notif);
            setTimeout(updateInboxIndicator, 100);
        }, i * 800);
    });
}

function clearSceneNotifications() {
    const container = document.getElementById('notifications');
    container.innerHTML = '';
    document.getElementById('inboxIndicator').classList.remove('show');
}

function toggleContinueButton(show) {
    const btn = document.querySelector('.scene.active .btn-continue');
    if (!btn) return;
    if (choiceMade && show) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
}

function startGame() {
    document.getElementById('titleScene').classList.remove('active');
    document.getElementById('statsBar').style.display = 'flex';
    showScene(1);
    showSceneNotifications(1);
}

function showScene(num) {
    currentScene = num;
    choiceMade = false;
    canContinue = false;
    clearSceneNotifications();
    
    document.querySelectorAll('.decision-btn').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(`scene${num}`).classList.add('active');
    updateStats();
    toggleContinueButton(false);
    
    if (num <= 7) {
        setTimeout(() => showSceneNotifications(num), 500);
    }
}

function updateStats() {
    prestige = Math.max(0, Math.min(100, prestige));
    ethics = Math.max(0, Math.min(100, ethics));
    
    document.getElementById('prestigeValue').textContent = prestige;
    document.getElementById('ethicsValue').textContent = ethics;
}

function makeChoice(scene, choice, prestigeChange, ethicsChange) {
    if (choiceMade) return;
    choiceMade = true;
    canContinue = true;
    
    const consequences = {
        1: {
            basic: "Has elegido un camino más seguro. Investiga embriones que nunca nacerán, lo cual genera conocimiento valioso pero poco reconocimiento inmediato.",
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
            implant: "Continúas con la implantación a pesar de los resultados mixtos. Asumes riesgos desconocidos por el avance científico."
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

    if (!consequences[scene] || !consequences[scene][choice]) {
        console.error(`[GAME ERROR] Missing consequence for scene ${scene}, choice '${choice}'`);
        return;
    }

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

    console.log(`[DECISION] Escena ${scene} → '${choice}' | Prestigio: ${prestige} | Ética: ${ethics}`);

    toggleContinueButton(true);
    
    const decisionBtns = document.querySelectorAll('.scene.active .decision-btn');
    decisionBtns.forEach(btn => {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.5';
    });
}

function goToNextScene() {
    if (!choiceMade) return;
    
    if (currentScene < 7) {
        showScene(currentScene + 1);
    } else {
        showEnding();
    }
}

function showEnding() {
    document.getElementById('statsBar').style.display = 'none';
    document.getElementById('inboxIndicator').classList.remove('show');
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById('endingScene').classList.add('active');

    const finalPrestige = Math.max(0, Math.min(100, prestige));
    const finalEthics = Math.max(0, Math.min(100, ethics));

    document.getElementById('finalPrestige').textContent = finalPrestige;
    document.getElementById('finalEthics').textContent = finalEthics;

    let description = "";
    
    if (finalPrestige >= 65 && finalEthics >= 65) {
        description = "Has logrado un equilibrio excepcional: alto prestigio científico junto con integridad ética inquebrantable. Tu trabajo, aunque controvertido, fue reconocido por su rigor y transparencia. La historia recuerda tu caso como un ejemplo de cómo navegar los límites de la ciencia con responsabilidad. Las regulaciones posteriores se inspiraron en tu enfoque cuidadoso.";
    } else if (finalPrestige >= 65 && finalEthics <= 35) {
        description = "Alcanzaste el estrellato científico, pero a un costo ético enorme. Tu caso se estudia hoy como ejemplo de los peligros de priorizar el reconocimiento sobre la seguridad. Fuiste etiquetado como el 'científico loco', perpetuando exactamente el estereotipo que el juego buscaba cuestionar. Las gemelas crecen bajo escrutinio constante.";
    } else if (finalPrestige <= 35 && finalEthics >= 65) {
        description = "Mantuviste tu integridad ética con firmeza, pero el mundo apenas conoce tu nombre. Tu investigación fue valiosa y metodológicamente impecable, aunque no transformadora. Quizás fue lo correcto, pero el debate sobre edición genética en humanos sigue sin beneficiarse plenamente de tu experiencia. Duermes tranquilo.";
    } else if (finalPrestige <= 35 && finalEthics <= 35) {
        description = "El resultado más desafortunado: ni prestigio ni integridad. Tu caso fue un desastre mediático y científico que dañó tu reputación y la discusión sobre edición genética. La lección es clara: sin ética ni rigor profesional, el impacto se pierde. Las autoridades chinas usaron tu caso como ejemplo de lo que no debe hacerse.";
    } else if (finalPrestige >= 65 && finalEthics > 35) {
        description = "Elegiste el camino del reconocimiento con cierta conciencia ética. Lograste visibilidad significativa, aunque algunos colegas cuestionan tus métodos. La historia te recuerda por tus contribuciones, pero con matices. Tu caso impulsó debates importantes sobre los límites de la edición genética.";
    } else if (finalEthics >= 65 && finalPrestige > 35) {
        description = "Priorizaste la ética con un reconocimiento científico moderado. Tu nombre no resonó en los grandes medios, pero la comunidad especializada respeta tu trabajo. Las gemelas reciben atención médica adecuada y tu investigación sienta bases para futuros estudios responsables.";
    } else if (finalPrestige > finalEthics) {
        description = "Elegiste el camino del reconocimiento sobre la rectitud en la mayoría de tus decisiones. Lograste visibilidad, pero a costa de compromisos éticos. La historia te recuerda más por tus métodos que por tus contribuciones. El debate sobre edición genética se vio empañado por tu caso.";
    } else {
        description = "Priorizaste la ética sobre la gloria en la mayoría de tus decisiones. Tu nombre no resonó en los medios, pero dormiste tranquilo sabiendo que priorizaste la seguridad sobre la ambición. Tu trabajo contribuye silenciosamente al avance responsable de la ciencia.";
    }

    document.getElementById('endingDescription').textContent = description;
}

function restartGame() {
    prestige = 50;
    ethics = 50;
    currentScene = 1;
    choiceMade = false;
    canContinue = false;
    
    document.querySelectorAll('.consequence').forEach(el => el.remove());
    clearSceneNotifications();
    document.querySelectorAll('.decision-btn').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });
    document.getElementById('inboxIndicator').classList.remove('show');
    document.getElementById('endingScene').classList.remove('active');
    document.getElementById('titleScene').classList.add('active');
    document.getElementById('statsBar').style.display = 'none';
    updateStats();
}

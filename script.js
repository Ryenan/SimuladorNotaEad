function showModal(title, message) {
  const modal = document.getElementById('custom-alert');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const okBtn = document.getElementById('modal-ok-btn');

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  modal.style.display = 'flex';

  disablePageInteraction(true);

  function closeModal(){
    modal.style.display = 'none';
    disablePageInteraction(false);
  }

  document.addEventListener('keydown', apertarEnter);

  function apertarEnter(event){
    if (event.key === 'Enter'){
      closeModal();
    }
  };

  okBtn.onclick = function() {
    closeModal();
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal()
    }
  };

};

function disablePageInteraction(disable) {
  const elements = document.querySelectorAll('input, select, textarea');
  
  elements.forEach(function(element) {
      element.disabled = disable;
      element.setAttribute('tabindex', disable ? '-1' : '0'); 
  });
}

function nafModal(){
  showModal('Campo bloqueado', 'Simule sua nota para liberar o campo NAF');
}

document.querySelectorAll('.nota').forEach(function(input) {
  input.addEventListener('input', function() {
    
    let value = this.value;

    if (value.length > 4) {
        this.value = value.slice(0, 4);
    }

    value = parseFloat(this.value.replace(',', '.'));

    if (value < 0) {
        this.value = null;
        showModal('Nota inválida', 'A nota mínima é 0.');
    } 
    else if (value > 10) {
        this.value = null;
        showModal('Nota inválida', 'A nota máxima é 10.');
    }

  });
});

const calcularMedia = () => {
  const PP = document.getElementById('PP');
  const AD = document.getElementById('AD');
  const F = document.getElementById('F');
  const PT = document.getElementById('PT');
  const nafInput = document.getElementById('naf');
  const pNaf = document.getElementById('pNaf');
  const blockText = document.getElementById('nafText');
  const containerNaf = document.getElementById('containerNaf');
  const status = document.getElementById('status');

  const happyFeijao = document.getElementById('happy');
  const maybeFeijao = document.getElementById('maybe');
  const sadFeijao = document.getElementById('sad');

  const ppValue = +PP.value || 0;
  const adValue = +AD.value || 0;
  const fValue = +F.value || 0;
  const ptValue = +PT.value || 0;

  if (PP.value.trim() === '' || AD.value.trim() === '' || F.value.trim() === '' || PT.value.trim() === '') {
    blockText.textContent = '';
    status.textContent = '';
    nafInput.value = '';
    nafInput.style.pointerEvents = 'none';
    nafInput.style.backgroundColor = '#919191';
    pNaf.style.color = 'black';
    mediaP.value = '';
    mediaF.value = '';

    happyFeijao.style.display = 'none';
    maybeFeijao.style.display = 'none';
    sadFeijao.style.display = 'none';

    containerNaf.onclick = function () {
      nafModal();
    };

    return;
  }

  containerNaf.onclick = null;

  const MP = (ppValue * 0.5) + (adValue * 0.1) + (fValue * 0.1) + (ptValue * 0.3);
  const validMP = Math.max(0, Math.min(10, MP));
  mediaP.value = validMP.toFixed(2);

  nafInput.style.pointerEvents = 'none';
  nafInput.style.backgroundColor = '#919191';
  pNaf.style.color = 'black';
  mediaF.value = '';

  if (validMP >= 7) {
    blockText.textContent = 'Você não precisará fazer NAF.';
    status.textContent = 'Aprovado';
    status.style.color = 'Green';

    happyFeijao.style.display = 'flex';
    maybeFeijao.style.display = 'none';
    sadFeijao.style.display = 'none';

    nafInput.value = '';
  } else if (validMP >= 3) {
    blockText.textContent = 'Você precisará fazer NAF para obter a média mínima.';

    nafInput.style.pointerEvents = 'auto';
    nafInput.style.backgroundColor = 'white';
    pNaf.style.color = 'black';

    status.textContent = 'NAF';
    status.style.color = 'Orange';

    happyFeijao.style.display = 'none';
    maybeFeijao.style.display = 'flex';
    sadFeijao.style.display = 'none';

    const naf = nafInput.value.trim() !== '' ? parseFloat(nafInput.value) : 0;

    if (nafInput.value.trim() !== '') {
      const MPT = (validMP + naf) / 2;
      const validMPT = Math.max(0, Math.min(10, MPT));
      mediaF.value = validMPT.toFixed(2);

      if (validMPT >= 5) {
        blockText.textContent = 'Com essa NAF você será aprovado.';
        status.textContent = 'Aprovado';
        status.style.color = 'Green';

        happyFeijao.style.display = 'flex';
        maybeFeijao.style.display = 'none';
        sadFeijao.style.display = 'none';
      } else {
        blockText.textContent = 'Com essa NAF você será reprovado.';
        status.textContent = 'Reprovado';
        status.style.color = 'Red';

        happyFeijao.style.display = 'none';
        maybeFeijao.style.display = 'none';
        sadFeijao.style.display = 'flex';
      }
    } else {
      mediaF.value = '';
    }
  } else {
    blockText.textContent = 'Você não obteve a média mínima para a NAF.';
    status.textContent = 'Reprovado';
    status.style.color = 'Red';

    happyFeijao.style.display = 'none';
    maybeFeijao.style.display = 'none';
    sadFeijao.style.display = 'flex';

    nafInput.value = '';
  }
};

document.getElementById('PP').addEventListener('input', calcularMedia);
document.getElementById('AD').addEventListener('input', calcularMedia);
document.getElementById('F').addEventListener('input', calcularMedia);
document.getElementById('PT').addEventListener('input', calcularMedia);
document.getElementById('naf').addEventListener('input', calcularMedia);

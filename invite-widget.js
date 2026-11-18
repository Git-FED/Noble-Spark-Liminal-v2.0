(() => {
  const modal = document.getElementById('inviteModal');
  const open = document.getElementById('openInvite');
  const close = document.getElementById('closeInvite');
  if (!modal || !open || !close) return;
  open.addEventListener('click', () => modal.showModal());
  close.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    const rect = modal.querySelector('.invite-panel').getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
  });
})();

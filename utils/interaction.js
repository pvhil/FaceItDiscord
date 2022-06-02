const getInteractionOption = (interaction, name) => {
  return interaction.options?._hoistedOptions?.filter(o => o.name === name)[0]?.value
}

const editInteraction = (interaction, resp) => {
  if (!resp) return
  interaction.fetchReply()
    .then(e => {
      e.removeAttachments().catch((err) => console.log(err, 'error removing attachments'))
      e.edit(resp).catch((err) => console.log(err, 'error editing interaction'))
    })
}

module.exports = {
  getInteractionOption,
  editInteraction,
}
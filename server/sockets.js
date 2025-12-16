function sockets(io, socket, data, users) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('signup', function(d) {
    const result = users.addUser(d.name, d.email, d.password);
    socket.emit('signupResponse', {success: result.success, message: result.message, users: users.users});
  });

  socket .on ('login', async function(d) {
    const result = await users.validateUser(d.email, d.password);
    socket.emit('loginResponse', result);
    
  });
  socket.on('CreateGroup', function(d) {
    const result = users.createGroup(d.email, d.groupName, d.priceRange);
    socket.emit('createGroupResponse', result);
  });


  //kom ihåg att radera alla nedanstående sen när all kod är klar, det är gammal kod//

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.activateQuestion(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('questionUpdate', data.activateQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.activateQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  }); 
}

//kom ihåg att radera alla ovanstående sen när all kod är klar, det är gammal kod//

export { sockets };
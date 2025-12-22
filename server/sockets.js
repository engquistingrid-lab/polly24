
function sockets(io, socket, data, users, groups ) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on("createGroup", (inputData)=> {
    const group = groups.createGroup(inputData.groupName,inputData.userName);
    socket.emit("groupCreated", {
      groupCode:group.code, 
      groupName:group.name
    });
  });

  socket.on("getGroupInfo", (inputData)=>{
    const group = groups.getGroup(inputData.groupCode);
    if (group) {
      socket.emit("groupInfo",{
      success:true,
      groupName: group.name,
      members: group.members
      });
    }
    else {
      socket.emit("groupInfo", {
      success: false,
      message: "Group not found"
      });
    }
  });

  socket.on("joinGroup", (inputData)=>{
    const wishes = [inputData.wish1, inputData.wish2, inputData.wish3].filter(w => w);//gör så att tomma "önskningar inte skickas med
    const joined = groups.joinGroup(inputData.groupCode, inputData.userName, wishes);
    if(joined) {
      socket.join(inputData.groupCode);

      socket.emit("joinedGroup", {
        success:true,
        groupCode: inputData.groupCode
      });
    } else { 
      socket.emit("joinedGroup", {
        success:false,
        message: "{{uiLabels.GroupNotFound}}"
      });
    }
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
function sockets(io, socket, users, groups) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', groups.getUILabels(lang));
  });

  // Skapa grupp först, sen Gå med
  socket.on("createGroup", (d) => {
    // 1. Skapa tom grupp
    const group = groups.createGroup(d.groupName);
    
    // 2. Låt Admin gå med i den
    groups.joinGroup(group.code, socket.id, d.userName, d.wishes);
    
    socket.join(group.code);
    socket.emit("groupCreated", { groupCode: group.code });
    io.to(group.code).emit("updateGame", group);
  });

  socket.on("joinGame", (d) => {
    console.log(`--> Tar emot joinGame för grupp: ${d.groupCode} från ${d.userName}`);

    const group = groups.joinGroup(d.groupCode, socket.id, d.userName, d.wishes);
    
    if (group) {
        socket.join(d.groupCode);
        socket.emit("joinedSuccess", { groupCode: group.code });
        io.to(d.groupCode).emit("updateGame", group);
    } else {
        socket.emit("joinedError", { message: "Koden finns inte." });
    }
  });

  socket.on("getGroupInfo", (d) => {
    const group = groups.getGroup(d.groupCode);
    if(group) {
        // Om användaren laddar om sidan, se till att de hamnar i rummet igen
        socket.join(d.groupCode); 
        socket.emit("updateGame", group);
        socket.emit("groupInfo", { success: true, groupName: group.name, members: group.members }); 
    }
  });

  socket.on("getInspiration", (d) => {
      const topWishes = groups.getInspirationFor(d.groupCode, d.targetName);
      socket.emit("inspirationData", topWishes);
  });

  socket.on("generateSecretSanta", (d) => {
    groups.assignSecretSanta(d.groupCode);
    io.to(d.groupCode).emit("secretSantaGenerated");
  });

  socket.on("getMyAssignment", (d) => {
     const group = groups.getGroup(d.groupCode);
     if(group) {
         const me = group.members.find(m => m.id === socket.id);
         if(me && me.assignedTo) {
             socket.emit("assignmentData", { targetName: me.assignedTo });
         }
     }
  });

  socket.on("submitGuesses", (d) => {
    groups.submitGuesses(d.groupCode, d.userName, d.guesses);
    groups.calculateScores(d.groupCode);
    const group = groups.getGroup(d.groupCode);
    io.to(d.groupCode).emit("updateGame", group);
  });

  socket.on("endGame", (d) => {
      io.to(d.groupCode).emit("gameEnded");
  });
}

export { sockets };
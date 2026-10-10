
const roomSets = {
  library: {
    objects: [
      {
        id: "desk",
        name: "Dusty Desk",
        icon: "🗄️",
        description: "You open a drawer and discover an old brass key.",
        item: "Brass Key"
      },
      {
        id: "painting",
        name: "Strange Painting",
        icon: "🖼️",
        description: "Behind the painting, you discover a hidden symbol: MOON-27.",
        clue: "The hidden symbol is MOON-27."
      },
      {
        id: "bookshelf",
        name: "Rotating Bookshelf",
        icon: "📚",
        description: "Three books are marked: 4, 1, 7. The sequence may matter later.",
        clue: "The bookshelf sequence is 4-1-7."
      },
      {
        id: "safe",
        name: "Locked Safe",
        icon: "🔐",
        requiresItem: "Brass Key",
        requiresClue: "MOON-27",
        description: "The key turns and the symbol opens the safe. Inside is an Exit Key.",
        item: "Exit Key"
      },
      {
        id: "door",
        name: "Final Exit",
        icon: "🚪",
        isExit: true,
        description: "The final door opens only when you have solved all room puzzles."
      }
    ]
  },

  lab: {
    objects: [
      {
        id: "toolbox",
        name: "Technician's Toolbox",
        icon: "🧰",
        description: "Inside the toolbox is a magnetic key.",
        item: "Magnetic Key"
      },
      {
        id: "monitor",
        name: "Cracked Monitor",
        icon: "🖥️",
        description: "The screen flashes a hidden code: VOLT-42.",
        clue: "The monitor code is VOLT-42."
      },
      {
        id: "reactor",
        name: "Reactor Panel",
        icon: "⚡",
        description: "Four lights flash in this order: blue, red, green, blue.",
        clue: "The reactor sequence is blue-red-green-blue."
      },
      {
        id: "safe",
        name: "Emergency Cabinet",
        icon: "🔐",
        requiresItem: "Magnetic Key",
        requiresClue: "VOLT-42",
        description: "The cabinet unlocks. You retrieve the Exit Key.",
        item: "Exit Key"
      },
      {
        id: "door",
        name: "Blast Door",
        icon: "🚪",
        isExit: true,
        description: "The blast door requires every puzzle to be solved."
      }
    ]
  },

  mansion: {
    objects: [
      {
        id: "cabinet",
        name: "Antique Cabinet",
        icon: "🗄️",
        description: "A rusty key lies beneath a torn velvet cloth.",
        item: "Rusty Key"
      },
      {
        id: "mirror",
        name: "Whispering Mirror",
        icon: "🪞",
        description: "Letters appear in the mirror: NEVER LOOK BACK.",
        clue: "The mirror message is NEVER LOOK BACK."
      },
      {
        id: "portrait",
        name: "Family Portrait",
        icon: "🖼️",
        description: "The portrait has four scratches beneath the oldest figure.",
        clue: "The portrait has four scratches."
      },
      {
        id: "safe",
        name: "Crypt Chest",
        icon: "⚰️",
        requiresItem: "Rusty Key",
        requiresClue: "NEVER LOOK BACK",
        description: "The chest creaks open and reveals the Exit Key.",
        item: "Exit Key"
      },
      {
        id: "door",
        name: "Haunted Exit",
        icon: "🚪",
        isExit: true,
        description: "The mansion releases you only after all puzzles are solved."
      }
    ]
  },

  cyber: {
    objects: [
      {
        id: "server",
        name: "Server Rack",
        icon: "🖥️",
        description: "Behind a loose panel is an access key.",
        item: "Access Key"
      },
      {
        id: "terminal",
        name: "Encrypted Terminal",
        icon: "💻",
        description: "The terminal displays a hidden token: ROOT-808.",
        clue: "The terminal token is ROOT-808."
      },
      {
        id: "blueprint",
        name: "Network Blueprint",
        icon: "🗺️",
        description: "A highlighted route reads NODE-3 → NODE-7 → NODE-2.",
        clue: "The network route is 3-7-2."
      },
      {
        id: "safe",
        name: "Data Vault",
        icon: "🔐",
        requiresItem: "Access Key",
        requiresClue: "ROOT-808",
        description: "The vault opens and reveals the Exit Key.",
        item: "Exit Key"
      },
      {
        id: "door",
        name: "Firewall Exit",
        icon: "🚪",
        isExit: true,
        description: "Complete every puzzle to breach the firewall and escape."
      }
    ]
  },

  default: {
    objects: [
      {
        id: "drawer",
        name: "Hidden Drawer",
        icon: "🗄️",
        description: "You find a small brass key.",
        item: "Brass Key"
      },
      {
        id: "note",
        name: "Torn Note",
        icon: "📜",
        description: "A handwritten clue reads: SHADOW-19.",
        clue: "The hidden code is SHADOW-19."
      },
      {
        id: "shelf",
        name: "Dusty Shelf",
        icon: "📚",
        description: "Three symbols are carved into the shelf: sun, moon, star.",
        clue: "The symbol order is sun-moon-star."
      },
      {
        id: "safe",
        name: "Locked Safe",
        icon: "🔐",
        requiresItem: "Brass Key",
        requiresClue: "SHADOW-19",
        description: "The safe opens and reveals the Exit Key.",
        item: "Exit Key"
      },
      {
        id: "door",
        name: "Exit Door",
        icon: "🚪",
        isExit: true,
        description: "Solve all the puzzles to escape."
      }
    ]
  }
};

export function getRoomObjects(roomName = "") {
  const name = roomName.toLowerCase();

  if (name.includes("library")) return roomSets.library;
  if (name.includes("clockwork") || name.includes("quantum") || name.includes("lab")) {
    return roomSets.lab;
  }
  if (name.includes("mansion") || name.includes("hotel") || name.includes("temple")) {
    return roomSets.mansion;
  }
  if (name.includes("cyber") || name.includes("blacksite") || name.includes("vault")) {
    return roomSets.cyber;
  }

  return roomSets.default;
}
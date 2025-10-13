import{fakerDE_AT} from "@faker-js/faker";//leere klammer dann ctrl + abstand dann sieht man was man alles importieren kann von faker

//import prisma from "../prisma/client/client.js";

function main(){
  const musik_faker = fakerDE_AT.music;
console.log("Random Musik-Genre: ", musik_faker.genre());
console.log("Random Musik-Album: ", musik_faker.album());
console.log("Random Musik-Song Name: ", musik_faker.songName());
console.log("Random Musik-Artist: ", musik_faker.artist());
}

if (import.meta.main) {
  main();
}

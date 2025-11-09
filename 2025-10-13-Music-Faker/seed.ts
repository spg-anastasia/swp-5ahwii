import { fakerDE_AT as faker } from "@faker-js/faker";
import { PrismaClient } from "./prisma/client/client.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const genres = [];
  for (let i = 0; i < 5; i++) {
    genres.push(await prisma.genre.create({ data: { name: faker.music.genre() } }));
  }

  const artists = [];
  for (let i = 0; i < 10; i++) {
    artists.push(await prisma.artist.create({ data: { name: faker.music.artist() } }));
  }

  const albums = [];
  for (let i = 0; i < 5; i++) {
    const albumArtists = faker.helpers.arrayElements(artists, { min: 1, max: 3 });
    albums.push(
      await prisma.album.create({
        data: {
          name: faker.music.album(),
          erscheinungsjahr: faker.number.int({ min: 1980, max: 2025 }),
          artists: { connect: albumArtists.map(a => ({ id: a.id })) },
        },
      })
    );
  }

  for (let i = 0; i < 20; i++) {
    const album = faker.helpers.arrayElement(albums);
    const genre = faker.helpers.arrayElement(genres);
    const songArtists = faker.helpers.arrayElements(artists, { min: 1, max: 2 });

    await prisma.song.create({
      data: {
        name: faker.music.songName(),
        duration: faker.number.int({ min: 120, max: 420 }),
        album: { connect: { id: album.id } },
        genre: { connect: { id: genre.id } },
        artists: { connect: songArtists.map(a => ({ id: a.id })) },
      },
    });
  }

  console.log("Seeding complete!");
}

if (import.meta.main) {
  main()
    .catch((e) => console.error("Fehler beim Seeding:", e))
    .finally(async () => await prisma.$disconnect());
}

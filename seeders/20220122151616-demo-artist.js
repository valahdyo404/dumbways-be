"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.bulkInsert(
      "artists",
      [
        {
          name: "Post Malone",
          old: 26,
          type: "Solo",
          startCarerr: "2013",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Keanu Reeves",
          old: 57,
          type: "Solo",
          startCarerr: "1991",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Eminem",
          old: 49,
          type: "Solo",
          startCarerr: "1988",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ty Dolla Sign",
          old: 39,
          type: "Solo",
          startCarerr: "2004",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Qorygore",
          old: 30,
          type: "Solo",
          startCarerr: "2018",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "88rising",
          old: 7,
          type: "Group",
          startCarerr: "2015",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Joji",
          old: 29,
          type: "Solo",
          startCarerr: "2016",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Rich Brian",
          old: 22,
          type: "Solo",
          startCarerr: "2016",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "NIKI",
          old: 22,
          type: "Solo",
          startCarerr: "2016",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "SZA",
          old: 32,
          type: "Solo",
          startCarerr: "2011",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boyz II Men",
          old: 34,
          type: "Group",
          startCarerr: "1988",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("artists", null, {})
  },
}

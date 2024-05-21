"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@mail.com",
          fullName: "Admin",
          password:
            "$2b$10$ceM65e803i8CIM4UOwP2rO6RyMZi/CC8gr3ngCN0PwL/jwTn5oSO6",
          listAs: 1,
          gender: "male",
          phone: "08123456789",
          address: "Tangerang Utara",
          subscribe: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "valahdyo@mail.com",
          fullName: "Valahdyo Arbandy",
          password:
            "$2b$10$ceM65e803i8CIM4UOwP2rO6RyMZi/CC8gr3ngCN0PwL/jwTn5oSO6",
          listAs: 0,
          gender: "male",
          phone: "08123456789",
          address: "Tangerang Barat",
          subscribe: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "sabar@mail.com",
          fullName: "Sabar Hidayat",
          password:
            "$2b$10$ceM65e803i8CIM4UOwP2rO6RyMZi/CC8gr3ngCN0PwL/jwTn5oSO6",
          listAs: 0,
          gender: "male",
          phone: "08123456789",
          address: "Tangerang Selatan",
          subscribe: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "narji@mail.com",
          fullName: "Narji Saputra",
          password:
            "$2b$10$ceM65e803i8CIM4UOwP2rO6RyMZi/CC8gr3ngCN0PwL/jwTn5oSO6",
          listAs: 0,
          gender: "male",
          phone: "08123456789",
          address: "Balaraja",
          subscribe: 0,
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
    await queryInterface.bulkDelete("users", null, {})
  },
}

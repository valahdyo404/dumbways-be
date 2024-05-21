"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.bulkInsert(
      "music",
      [
        {
          title: "Circles",
          year: "2019",
          thumbnail: "dumbsound-file/Rectangles-4_deifsw.png",
          attache: "dumbsound-file/1_yfpibb.mp3",
          artisId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Logic",
          year: "2019",
          thumbnail: "dumbsound-file/Rectangles-4-1_kqm2jh.png",
          attache: "dumbsound-file/2_dltkto.mp3",
          artisId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Godzilla",
          year: "2020",
          thumbnail: "dumbsound-file/Rectangles-4-2_rody6q.png",
          attache: "dumbsound-file/3_yw6jeh.mp3",
          artisId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Never Ever (feat. Eminem & Drake)",
          year: "2019",
          thumbnail: "dumbsound-file/Rectangles-4-3_gpu3ms.png",
          attache: "dumbsound-file/4_i0lsu0.mp3",
          artisId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Love U Better ft. Lil Wayne & The-Dream",
          year: "2018",
          thumbnail: "dumbsound-file/Rectangles-4-4_ko5r5y.png",
          attache: "dumbsound-file/5_ugudry.mp3",
          artisId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Tragic",
          year: "2019",
          thumbnail: "dumbsound-file/Rectangles-4-5_qiwqnv.png",
          attache: "dumbsound-file/6_dfnioh.mp3",
          artisId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Midsummer",
          year: "2019",
          thumbnail: "dumbsound-file/Rectangles-4-6_l9hooo.png",
          attache: "dumbsound-file/7_zv1hhk.mp3",
          artisId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Slow Dancing In The Dark",
          year: "2018",
          thumbnail: "dumbsound-file/Rectangles-4-7_bq1tho.png",
          attache: "dumbsound-file/8_hp0ebz.mp3",
          artisId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "History",
          year: "2018",
          thumbnail: "dumbsound-file/Rectangles-4-8_sp4mb8.png",
          attache: "dumbsound-file/9_mp9zos.mp3",
          artisId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "I LIKE U",
          year: "2017",
          thumbnail: "dumbsound-file/Rectangles-4-9_vegfgh.png",
          attache: "dumbsound-file/10_sxy0tt.mp3",
          artisId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Love Galore",
          year: "2017",
          thumbnail: "dumbsound-file/Rectangles-4-10_pxdnpj.png",
          attache: "dumbsound-file/11_aewzvk.mp3",
          artisId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "End Of The Road",
          year: "1991",
          thumbnail: "dumbsound-file/Rectangles-4-11_vcggrz.png",
          attache: "dumbsound-file/12_qijh9o.mp3",
          artisId: 11,
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
    await queryInterface.bulkDelete("music", null, {})
  },
}

import path from 'path';
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

export default {
  bots: {
    1: {
      name: "Bot 1",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.desimoviecomedyy,
        caption: "Wait for the punchline 🤣 Which meme is 100% you? 👇 Link in bio for more chaos!",
        hashtags: [
          "#funny", "#meme", "#comedy", "#lol", "#viral", "#dankmemes", "#laugh", "#funnymemes", "#relatable",
          "#humor", "#trending", "#hilarious", "#fyp", "#rofl", "#epicfail", "#jokes", "#dailyfunny",
          "#memeoftheday", "#haha", "#entertainment", "#lmao", "#prank", "#comedian", "#standup",
          "#laughter", "#tiktokfunny", "#cringe", "#cursedcomments", "#memesdaily", "#funnyvideos",
          "#justforfun", "#funnyvideo", "#jokeoftheday", "#sarcasm", "#parody", "#bestmemes",
          "#tiktokmemes", "#funnyclips", "#humour", "#memer"
        ],
        subreddit: "t/funny",
      }
    },
    2: {
      name: "Bot 2",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.samandarsinghsher2,
        caption: "POV: You find the most chaotic Reddit content. Rate this deep dive 1-10! 😵 Link in bio.",
        hashtags: [
          "#funny", "#meme", "#comedy", "#lol", "#viral", "#dankmemes", "#laugh", "#funnymemes", "#relatable",
          "#humor", "#trending", "#hilarious", "#fyp", "#rofl", "#epicfail", "#jokes", "#dailyfunny",
          "#memeoftheday", "#haha", "#entertainment", "#lmao", "#prank", "#comedian", "#standup",
          "#laughter", "#tiktokfunny", "#cringe", "#cursedcomments", "#memesdaily", "#funnyvideos",
          "#justforfun", "#funnyvideo", "#jokeoftheday", "#sarcasm", "#parody", "#bestmemes",
          "#tiktokmemes", "#funnyclips", "#humour", "#pewdiepie"
        ],
        subreddit: "t/comedy",
      }
    },
    3: {
      name: "Bot 3",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.samandarsinghsher3,
        caption: "Lost in the shot. 📸 What’s the first word that comes to mind? Let the art speak! Link in bio. ",
        hashtags: [
          "#photography", "#photooftheday", "#picoftheday", "#photographer", "#instaphoto", "#visualart",
          "#exposure", "#composition", "#capture", "#moment", "#shutter", "#photo", "#instadaily",
          "#art", "#artist", "#artwork", "#creative", "#drawing", "#illustration", "#painting",
          "#digitalart", "#sketch", "#artoftheday", "#instaart", "#design", "#artistsoninstagram",
          "#fineart", "#contemporaryart", "#abstractart", "#artgallery", "#artlovers", "#travelphotography",
          "#landscape", "#naturephotography", "#portrait", "#visualart", "#photoshop", "#lightroom",
          "#streetphotography", "#blackandwhite", "#beautifuldestinations", "#travelgram"
        ],
        subreddit: "t/photography",
      }
    },
    4: {
      name: "Bot 4",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.samandarsinghsher4,
        caption: "Drop a 🔥 if this is your new favorite song! Full track link in bio. Turn up the volume! 🎧",
        hashtags: [
          "#music", "#song", "#musician", "#singer", "#artist", "#newmusic", "#instamusic", "#genre",
          "#playlist", "#musiclover", "#singing", "#musical", "#tiktokmusic", "#musicoftheday",
          "#musicislife", "#goodmusic", "#favoritesong", "#viralsong", "#cover", "#coversong",
          "#livemusic", "#acoustic", "#originalmusic", "#djremix", "#musicvideo", "#lyricsvideo",
          "#instrumental", "#beat", "#producer", "#songwriter", "#guitar", "#piano", "#drums",
          "#rapper", "#edm", "#hiphop", "#rock", "#pop", "#indie", "#rnb", "#jazz", "#classicalmusic"
        ],
        subreddit: "t/music",
      }
    },
    5: {
      name: "Bot 5",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.samandarsinghsher5,
        caption: "Is this heaven? 🤤 Tag a friend who needs this right now! Best recipes in the link in bio. 🍔",
        hashtags: [
          "#food", "#foodie", "#instafood", "#foodporn", "#yummy", "#delicious", "#foodphotography",
          "#foodlover", "#eat", "#tasty", "#cooking", "#homemade", "#chef", "#recipes", "#instacook",
          "#foodgasm", "#foodstagram", "#foodpics", "#hungry", "#comfortfood", "#goodeats", "#baking",
          "#dessert", "#breakfast", "#lunch", "#dinner", "#homecooking", "#healthyeating",
          "#veganfood", "#vegetarian", "#pizza", "#bbq", "#seafood", "#brunch", "#cookinghacks",
          "#recipeshare", "#foodblogger", "#eatlocal", "#sweettooth", "#cleaneating", "#gourmet",
          "#culinary", "#easyrecipes", "#cookingtime"
        ],
        subreddit: "t/food",
      }
    },
    6: {
      name: "Bot 6",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.sakshisinghkunwar1,
        caption: "The glow-up is REAL ✨ Steal this look! Product list and tutorial link in bio. 💅",
        hashtags: [
          "#beauty", "#makeup", "#fashion", "#style", "#beautiful", "#skincare", "#glam",
          "#instabeauty", "#makeuplover", "#beautyblog", "#cosmetics", "#selfcare", "#motd",
          "#makeuptutorial", "#eyeshadow", "#lipstick", "#foundation", "#eyeliner", "#lashes",
          "#brows", "#makeuplooks", "#mua", "#makeuptips", "#palette", "#glitter",
          "#skincareroutine", "#glowingskin", "#healthyskin", "#beautyhacks", "#selfcareroutine",
          "#naturalskincare", "#serum", "#ootd", "#instastyle", "#fashionista", "#stylish",
          "#model", "#trending", "#aesthetic", "#hair", "#nailart", "#beautytips", "#beautyproducts"
        ],
        subreddit: "t/fashion",
      }
    },
    7: {
      name: "Bot 7",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.sakshisinghkunwar2,
        caption: "My heart just melted 🥺 What's the cutest thing your pet/kid does? Tell me below! 👇",
        hashtags: [
          "#cute", "#aww", "#adorable", "#wholesome", "#mademesmile", "#happy", "#love",
          "#cuteness", "#instacute", "#goodvibes", "#sweet", "#baby", "#babylove",
          "#kidsofinstagram", "#familytime", "#beautiful", "#lovely", "#happiness",
          "#heart", "#fun", "#friends", "#relatable", "#inspo", "#cuddle", "#playtime",
          "#cutekids", "#bestoftheday", "#viral", "#trending", "#foryou", "#cuteanimals",
          "#dogsofinstagram", "#catlover", "#puppy", "#kitten", "#petsofinstagram",
          "#dogs", "#cats", "#animales", "#pets", "#cutepets", "#wholesomememes"
        ],
        subreddit: "t/animals_and_pets",
      }
    },
    8: {
      name: "Bot 8",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.sakshisinghkunwar3,
        caption: "Catch flights, not feelings. 😉 Best travel tips and gear link in bio! Where should I go next? 🗺️",
        hashtags: [
          "#travel", "#travelphotography", "#wanderlust", "#travelgram", "#instatravel",
          "#adventure", "#explore", "#vacation", "#tourism", "#getaway", "#trip", "#worldtravel",
          "#travelblogger", "#traveling", "#instago", "#passportready", "#destination",
          "#exploretheworld", "#traveller", "#beautifuldestinations", "#traveltheworld",
          "#nature", "#landscape", "#solotravel", "#backpacking", "#roadtrip", "#digitalnomad",
          "#citybreak", "#beachlife", "#mountain", "#hike", "#traveltips", "#traveladdict",
          "#travelholic", "#wanderer", "#outdoors", "#summer", "#sunset", "#earthporn",
          "#globetrotter", "#explorepage", "#travelcouple", "#budgettravel"
        ],
        subreddit: "t/travel",
      }
    },
    9: {
      name: "Bot 9",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.sakshisinghkunwar4,
        caption: "In need of Vitamin Sea. ☀️🌊 Tag your beach partner! More summer content in bio. 🌴",
        hashtags: [
          "#summer", "#beach", "#beachlife", "#summerVibes", "#sunshine", "#ocean", "#travel",
          "#vacation", "#beachday", "#sandytoes", "#coastalLiving", "#tropical", "#sea",
          "#waves", "#swim", "#bikini", "#summerfun", "#beachy", "#outdoors", "#nature",
          "#adventure", "#hiking", "#camping", "#explore", "#getoutside", "#mountain",
          "#trails", "#roadtrip", "#freshair", "#wilderness", "#getoutdoors", "#staycation",
          "#active", "#wanderlust", "#sunset", "#outdoorlife", "#dayatthebeach", "#beachtherapy",
          "#summer2025", "#surf", "#beachlover", "#happyplace", "#goodtimes"
        ],
        subreddit: "t/outdoors",
      }
    },
    10: {
      name: "Bot 10",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.sakshisinghkunwar6,
        caption: "Art is the journey of a free soul. 🎨 What does this piece make you feel? Let me know! 👇",
        hashtags: [
          "#art", "#artist", "#artwork", "#creative", "#drawing", "#illustration", "#painting",
          "#digitalart", "#sketch", "#artoftheday", "#instaart", "#design", "#artistsoninstagram",
          "#fineart", "#contemporaryart", "#abstractart", "#artgallery", "#artlovers", "#artistic",
          "#creativity", "#supportartists", "#artlife", "#pencildrawing", "#watercolor",
          "#oilpainting", "#acrylicpainting", "#digitalpainting", "#procreate", "#traditionalart",
          "#sketchbook", "#conceptart", "#sculpture", "#fanart", "#lineart", "#dailydrawing",
          "#illustrationart", "#doodle", "#inkdrawing", "#artcommunity", "#artinspiration",
          "#artshare", "#creativeNetwork", "#visualart", "#draw"
        ],
        subreddit: "t/art",
      }
    },
  }
};

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});

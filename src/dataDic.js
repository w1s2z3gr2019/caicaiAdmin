module.exports={
    regularData:{
        userName:/[`~!@#$%^&*()_\-+=<>?:"{}|,/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im,
        pass:/[\u4e00-\u9fa5]/
    },
    //左侧菜单
    //访客性别
    sex:[
        {
            value:1,
            key:'男'
        },
        {
            value:2,
            key:'女'
        },
        {
            value:3,
            key:'保密'
        }
    ],
    activeType:[
        {
            value:1,
            key:'每日'
        },
        {
            value:2,
            key:'每周'
        },
        {
            value:3,
            key:'每月'
        }
    ],
    luckDrawType:[
        {
            value:1,
            key:'精确抽奖'
        },
        {
            value:2,
            key:'极限概率'
        },
        {
            value:3,
            key:'随机抽奖'
        } 
    ],
    titleType:[
        {
            value:1,
            key:'按话题分类'
        },
        {
            value:2,
            key:'按频率分类'
        },
        {
            value:3,
            key:'按中奖方式'
        } 
    ],
    topic:[
        {
            value:0,
            key:'热门'
        },
        {
            value:1,
            key:'体育'
        },
        {
            value:2,
            key:'娱乐'
        },
        {
            value:3,
            key:'军事'
        }
    ],
    cycle:[
        {
            value:1,
            key:'每日'
        },
        {
            value:2,
            key:'每周'
        },
        {
            value:3,
            key:'每月'
        }
    ],
    sponsorData:[
        {
            value:1,
            key:'猜奖官方'
        },
        {
            value:2,
            key:'赞助商'
        }
    ],
}
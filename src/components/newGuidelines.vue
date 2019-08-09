<template>
    <!-- 遮罩 -->
    <div class="guideShade" v-if="!isFristOpen">
        <!-- 立即体验 -->
        <div class="firstStep" v-if='experienceOne'>
            <img src="../assets/firstStep.png" alt="">
            <div class="experience" @click="experience">立即体验</div>
            <img class="guideClose" @click="closeGuide" src="../assets/guideClose.png" alt="">
        </div>
        <!-- 第一步 -->
        <div class="secondStep" v-if="friseStep">
            <div class="guildSearch">
                <div class="guildSearchArea">
                    <img src="../assets/search.png">
                    <span>请输入搜索内容~</span>
                </div>
            </div>
            <img class="secondStepImg" src="../assets/searchHint.png" alt="">
            <img class="iKnow" @click="nextFrist" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第二步 -->
        <div class="thirdStep" v-if="secondStep">
            <div class="sourceImg"><img class="" src="../assets/sourceHint.png" alt=""></div>
            <div class="guildSource">
                <img src="../assets/source_active.png" alt="">
                <span>源头好产品</span>
            </div>
            <img class="iKnow" @click="nextSecond" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第三步 -->
        <div class="thirdStep fourthStep" v-if="thirdStep">
            <div class="sourceImg"><img class="" src="../assets/loaclHint.png" alt=""></div>
            <div class="guildSource">
                <img src="../assets/serve_active_aa.png" alt="">
                <span>本地好服务</span>
            </div>
            <img class="iKnow" @click="nextThird" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第四步 -->
        <div class="fifthStep" v-if="fourthStep">
            <div class="meunShopCut">主商品</div>
            <img class="firseStepImg" src="../assets/mainShopHint.png" alt="">
            <img class="iKnow" @click="nextFourth" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第五步 -->
        <div class="fifthStep sixthStep" v-if="fifthStep">
            <div class="meunShopCut">赠品</div>
            <img class="firseStepImg" src="../assets/presentShopHint.png" alt="">
            <img class="iKnow" @click="nextFivth" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第六步 -->
        <div class="seventStep" :class="{'classFly': isClassfiy}" v-if="sixthStep">
            <div class="seventStepArea">
                <img v-for="(item,index) in list" :key="index" :src="item.pic" alt="">
            </div>
            <img class="seventStepImg" src="../assets/activityHint.png" alt="">
            <img class="iKnow" @click="nextSixth" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第七步 -->
        <div class="thirdStep eighthStep" v-if="seventStep">
            <div class="sourceImg"><img class="" src="../assets/shopCatHint.png" alt=""></div>
            <div class="shopCarHint">
                <span class="shopGroup"></span>
                <span class="shopCarHintNum">5</span>
            </div>
            <img class="iKnow" @click="nextServeth" src="../assets/iKnow.png" alt="">
        </div>
        <!-- 第八步 -->
        <div class="thirdStep ninthStep" v-if="eighthStep">
            <div class="sourceImg"><img class="" src="../assets/personalHint.png" alt=""></div>
            <div class="guildSource">
                <img src="../assets/my_active.png" alt="">
                <span>个人中心</span>
            </div>
            <img class="iKnow" @click="nextEighth" src="../assets/iKnow.png" alt="">
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            list: {
                type: Array,
                default: () => {
                    return []
                }
            },
            isClassfiy: { // 是有存在分类
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                isFristOpen: true,
                experienceOne: true,
                friseStep: false,  // 第一步
                secondStep: false,  // 第二步
                thirdStep: false,  // 第三步
                fourthStep: false,  // 第四步
                fifthStep: false,  // 第五步
                sixthStep: false,   // 第六步
                seventStep: false,  // 第七步
                eighthStep: false,  // 第八步
                ninthStep: false,  // 第九步
            }
        },
        created(){
            this.isFristOpen = localStorage.getItem("isFristOpen") == 'true' ? true : false;
            if(!this.isFristOpen){
                this.request();
            }
        },
        methods:{
            // 请求后台
            request(){
                this.dataService.newGuidelines().then(resp => {
                    this.dataService.handleResponse({
                        data: resp,
                        callback: (data) => {
                            if(data.isfirstopen == 2){
                                this.closeGuide();
                            }else{
                                this.isFristOpen = false;
                            }
                        }
                    });
                });
            },
            // 立即体验
            experience(){
                this.experienceOne = false;
                this.friseStep = true;
            },
            // 第一步
            nextFrist(){
                this.friseStep = false;
                this.secondStep = true;
            },
            // 第二步
            nextSecond(){
                this.secondStep = false;
                this.thirdStep = true;
            },
            // 第三步
            nextThird(){
                this.thirdStep = false;
                this.fourthStep = true;
            },
            // 第四步
            nextFourth(){
                this.fourthStep = false;
                this.fifthStep = true;
            },
            // 第五步
            nextFivth(){
                this.fifthStep = false;
                this.sixthStep = true;
            },
            // 第六步
            nextSixth(){
                this.sixthStep = false;
                this.seventStep = true;
            },
            // 第七步
            nextServeth(){
                this.seventStep = false;
                this.eighthStep = true;
            },
            // 第八步
            nextEighth(){
                this.eighthStep = false;
                this.isFristOpen = true;
                localStorage.setItem("isFristOpen",true);
            },
            // 关闭提示
            closeGuide(){
                this.isFristOpen = true;
                localStorage.setItem("isFristOpen",true);
            }
        }
    }
</script>
<style lang="less">
    @import url('../less/common.less');
    // 遮罩
    .guideShade{
        position: fixed;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 999999;
        .iKnow{
            position: absolute;
            .pxRem(right,46);
            .pxRem(width,198);
        }
    }
    // 第一步
    .firstStep{
        position: relative;
        margin: 0 auto;
        max-width: 720px;
        >img{
            width: 100%;
            .pxRem(margin-top, 142);
        }
        >.experience{
            position: absolute;
            .pxRem(top,880);
            .pxRem(left,216);
            .pxRem(width,288);
            .pxRem(line-height,80);
            .pxRem(border-radius,40);
            .pxRem(font-size,44);
            text-align: center;
            color: @white-color;
            background: @red-color;
        }
        .guideClose{
            position: absolute;
            .pxRem(right,80);
            .pxRem(top,50);
            .pxRem(width,40);
        }
    }
    // 第二步
    .secondStep{
        position: relative;
        >.guildSearch{
            .pxRem(margin-left,78);
            .pxRem(margin-top,3);
            .pxRem(width,566);
            .pxRem(height,88);
            .pxRem(border-radius,8);
            .border(4,@red-color);
            background-color: @white-color;
        }
        .guildSearchArea{
            .pxRem(margin-left, 6);
            .pxRem(margin-top, 8);
            .pxRem(width,546);
            .pxRem(height,64);
            .pxRem(line-height,64);
            .flex();
            .alignItems();
            .pxRem(font-size,24);
            .pxRem(border-radius,12);
            background: #F2F1F0;
            color: @gray-light-text;
            >img{
                .pxRem(margin-left,32);
                .pxRem(margin-right,16);
                .pxRem(width,24);
                .pxRem(height,24)
            }
        }
        >.secondStepImg{
            .pxRem(width,564);
            .pxRem(margin-left,58);
            .pxRem(margin-top,36);
        }
        .iKnow{
            .pxRem(top,400);
        }
    }
    // 第三步
    .thirdStep{
        position: relative;
        .flex();
        .flexWrap(wrap);
        align-content: flex-end;
        height: 100%;
        .iKnow{
            .pxRem(bottom,330);
        }
        .guildSource{
            .flex();
            .alignItems(center);
            .flexWrap(wrap);
            .pxRem(width,146);
            .pxRem(height,92);
            .border(4, @red-color);
            .pxRem(border-radius,8);
            .pxRem(margin-left,50);
            background: @white-color;
            .pxRem(font-size,20);
            color: @red-color;
            >img{
                display: block;
                margin: 0 auto;
                .pxRem(width,44);
            }
            span{
                display: block;
                width: 100%;
                text-align: center;
            }
        }
        .sourceImg{
            width: 100%;
            >img{
                display: block;
                .pxRem(width,390);
                .pxRem(margin-left,170);
                .pxRem(margin-bottom,22);
            }
        }
    }
    // 第四步
    .fourthStep{
        .iKnow{
            .pxRem(bottom,430);
        }
        .guildSource{
            margin: 0 auto;
        }
        .sourceImg > img{
            .pxRem(width,524);
            .pxRem(margin-left,98);
        }
    }
    // 第五步
    .fifthStep{
        position: relative;
        .pxRem(margin-left,20);
        .pxRem(margin-top,116);
        .meunShopCut{
            .pxRem(width,338);
            .pxRem(line-height,62);
            .border(2,@red-color);
            .pxRem(font-size,32);
            background-color: @red-color;
            text-align: center;
            color: @white-color;
            .pxRem(border-top-left-radius,40);
            .pxRem(border-bottom-left-radius,40);
        }
        .firseStepImg{
            .pxRem(margin-top,10);
            .pxRem(width,402);
        }
        .iKnow{
            .pxRem(top,360)
        }
    }
    // 第六步
    .sixthStep{
        .pxRem(margin-left,20);
        .meunShopCut{
            .pxRem(width,345);
            .pxRem(margin-left,340);
            background-color: @white-color;
            color: @red-color;
            .pxRem(border-top-left-radius,0);
            .pxRem(border-bottom-left-radius,0);
            .pxRem(border-top-right-radius,40);
            .pxRem(border-bottom-right-radius,40);
        }
        .firseStepImg{
            .pxRem(width,364);
            .pxRem(margin-left,332);
        }
        .iKnow{
            .pxRem(top,430)
        }
    }
    // 第七步
    .seventStep{
        .pxRem(margin-top,510);
        .seventStepArea{
            .pxRem(padding,12);
            .flex();
            .justifyContent(space-between);
            .alignItems(center);
            .pxRem(border-radius,8);
            background-color: @white-color;
            .border(4, @red-color);
            >img{
                .pxRem(width,336);
                .pxRem(border-radius,8)
            }
        }
        .seventStepImg{
            .pxRem(width,524);
            display: block;
            margin: 0 auto;
            .pxRem(margin-top,24);
        }
        .iKnow{
            .pxRem(top,920);
            .pxRem(right,270);
        }
    }
    .classFly{
        .pxRem(margin-top,440);
    }
    // 第八步
    .eighthStep{
        position: relative;
        .sourceImg{
            >img{
                .pxRem(width,544);
                .pxRem(margin-left,80);
                margin-bottom: 0
            }
        }
        .shopCarHint{
            position: relative;
            .pxRem(width,86);
            .pxRem(height,86);
            .pxRem(margin-bottom,100);
            .flex();
            .justifyContent(center);
            .alignItems(center);
            .border(4,@red-color);
            border-radius: 50%;
            background-color: @white-color;
            .shopCarHintNum{
                position: absolute;
                right: 0;
                top: 0;
                .pxRem(width,24);
                text-align: center;
                .pxRem(line-height,24);
                .pxRem(font-size,16);
                .border(1,@red-color);
                background: @white-color;
                color: @red-color;
                border-radius: 50%;
            }
        }
        .iKnow{
            .pxRem(bottom,60);
        }
    }
    // 第九步
    .ninthStep{
        .guildSource{
            .pxRem(margin-left,530)
        }
        >.sourceImg > img{
            .pxRem(width,442);
        }
        .iKnow{
            .pxRem(bottom,365);
        }
    }
</style>

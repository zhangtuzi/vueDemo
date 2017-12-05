<template>
  <div id="provinceWarp">
        <div class="mc_bg"></div>
        <div class="dqqhxq">
            <div class="dq_tit">
                <img src="../assets/images/guanbi.png" alt="" class="dq_close" @click="closeProvinceTc()">
                <span>地区切换</span>
            </div>
            <div class="dq_mes">
                <div class="dq_l">
                    A<br>|<br>G
                </div>
                <ul class="dq_r">
                    <li class="li5" @click="provinceSelect('北京','011')" v-bind:class="{provinceBg:porvince=='北京'}">北京</li>
                    <li class="li5" @click="provinceSelect('安徽','030')" v-bind:class="{provinceBg:porvince=='安徽'}">安徽</li>
                    <li class="li5" @click="provinceSelect('重庆','083')" v-bind:class="{provinceBg:porvince=='重庆'}">重庆</li>
                    <li class="li5" @click="provinceSelect('福建','038')" v-bind:class="{provinceBg:porvince=='福建'}">福建</li>
                    <li class="li5" @click="provinceSelect('广东','051')" v-bind:class="{provinceBg:porvince=='广东'}">广东</li>
                    <li class="li5" @click="provinceSelect('甘肃','087')" v-bind:class="{provinceBg:porvince=='甘肃'}">甘肃</li>
                    <li class="li5" @click="provinceSelect('广西','059')" v-bind:class="{provinceBg:porvince=='广西'}">广西</li>
                    <li class="li5" @click="provinceSelect('贵州','085')" v-bind:class="{provinceBg:porvince=='贵州'}">贵州</li>
                </ul>
            </div>
            <div class="dq_mes">
                <div class="dq_l">
                    H<br>|<br>J
                </div>
                <ul class="dq_r">
                    <li class="li5" @click="provinceSelect('湖北','071')" v-bind:class="{provinceBg:porvince=='湖北'}">湖北</li>
                    <li class="li5" @click="provinceSelect('湖南','074')" v-bind:class="{provinceBg:porvince=='湖南'}">湖南</li>
                    <li class="li5" @click="provinceSelect('河北','018')" v-bind:class="{provinceBg:porvince=='河北'}">河北</li>
                    <li class="li5" @click="provinceSelect('河南','076')" v-bind:class="{provinceBg:porvince=='河南'}">河南</li>
                    <li class="li5" @click="provinceSelect('海南','050')" v-bind:class="{provinceBg:porvince=='海南'}">海南</li>
                    <li class="li5" @click="provinceSelect('江苏','034')" v-bind:class="{provinceBg:porvince=='江苏'}">江苏</li>
                    <li class="li5" @click="provinceSelect('吉林','090')" v-bind:class="{provinceBg:porvince=='吉林'}">吉林</li>
                    <li class="li5" @click="provinceSelect('江西','075')" v-bind:class="{provinceBg:porvince=='江西'}">江西</li>
                    <li class="li5" @click="provinceSelect('黑龙江','097')" v-bind:class="{provinceBg:porvince=='黑龙江'}">黑龙江</li>
                </ul>
            </div>
            <div class="dq_mes">
                <div class="dq_l">
                    L<br>|<br>S
                </div>
                <ul class="dq_r">
                    <li class="li5" @click="provinceSelect('辽宁','091')" v-bind:class="{provinceBg:porvince=='辽宁'}">辽宁</li>
                    <li class="li5" @click="provinceSelect('宁夏','088')" v-bind:class="{provinceBg:porvince=='宁夏'}">宁夏</li>
                    <li class="li5" @click="provinceSelect('青海','070')" v-bind:class="{provinceBg:porvince=='青海'}">青海</li>
                    <li class="li5" @click="provinceSelect('山东','017')" v-bind:class="{provinceBg:porvince=='山东'}">山东</li>
                    <li class="li5" @click="provinceSelect('上海','031')" v-bind:class="{provinceBg:porvince=='上海'}">上海</li>
                    <li class="li5" @click="provinceSelect('山西','019')" v-bind:class="{provinceBg:porvince=='山西'}">山西</li>
                    <li class="li5" @click="provinceSelect('陕西','084')" v-bind:class="{provinceBg:porvince=='陕西'}">陕西</li>
                    <li class="li5" @click="provinceSelect('四川','081')" v-bind:class="{provinceBg:porvince=='四川'}">四川</li>
                    <li class="li5" @click="provinceSelect('内蒙古','010')" v-bind:class="{provinceBg:porvince=='内蒙古'}">内蒙古</li>
                </ul>
            </div>
            <div class="dq_mes" style="margin-bottom:0.3rem;">
                <div class="dq_l">
                    T<br>|<br>Z
                </div>
                <ul class="dq_r">
                    <li class="li5" @click="provinceSelect('天津','013')" v-bind:class="{provinceBg:porvince=='天津'}">天津</li>
                    <li class="li5" @click="provinceSelect('新疆','089')" v-bind:class="{provinceBg:porvince=='新疆'}">新疆</li>
                    <li class="li5" @click="provinceSelect('西藏','079')" v-bind:class="{provinceBg:porvince=='西藏'}">西藏</li>
                    <li class="li5" @click="provinceSelect('云南','086')" v-bind:class="{provinceBg:porvince=='云南'}">云南</li>
                    <li class="li5" @click="provinceSelect('浙江','036')" v-bind:class="{provinceBg:porvince=='浙江'}">浙江</li>
                </ul>
            </div>
        </div>
  </div>
</template>

<script>
    export default {
        name: 'ProvinceComponent',
        data() {
            return {
                porvince:'北京',//省份名称
            }
        },
        props:['provinceName'],
        methods: {
            //选择以后，将省份名称和省份编码传回父组件
            provinceSelect:function (provinceName,provincecode){
                this.porvince=provinceName;
                this.$emit('provinceBack',provinceName,provincecode);
            },
            closeProvinceTc:function() {
                this.$emit('provinceClose');
            },
        },
        //省份弹层创建时获取当前省份
        created:function(){
            this.porvince=this.provinceName;
        }
    }
</script>
<style scoped>
    .mc_bg{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #000;
        opacity: 0.3;
        z-index: 2;
    }
    .dqqhxq{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;      
        background: #fff;
        z-index: 3;
    }
    .dq_tit{
        position: relative;
        margin-top: 0.2rem;
        height: 0.5rem;
        text-align: center;
        line-height: 0.5rem;
        font-size: 0.3rem;
        color:#fa5f03;
    }
    .dq_close{
        position: absolute;
        top: 0.13rem;
        left: 0.3rem;
        width: 0.25rem;
        height: 0.25rem;
    }
    .dq_mes{
        width: 100%;
        margin-top: 0.2rem;
        height:1.2rem;
    }
    .dq_l{
        clear: both;
        width: 0.2rem;
        height:0.9rem;
        margin-top:0.2rem;
        float: left;
        font-size: 0.2rem;
        text-align: center;
        margin-left: 0.35rem;
        color: #d3d3d3;
    }
    .dq_r{
        float: left;
        width:80%;
        height:1.2rem;
        margin-left: 0.4rem;
        font-size: 0.23rem;
        line-height: 0.4rem;
        text-align: center;
        color: #666;
    }
    .li5{
        float: left;
        position: relative;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
        line-height: 0.6rem;
    }
    .provinceBg{
        background-image: url('../assets/images/dizibenjing.png');
        background-size: 100% 0.6rem;
    }
    .dq_r li:after {
        content: "";
        display: block;
		clear: both;
    }
    .xzbj{
        position: absolute;
        top: 0;
        width: 0.6rem;
        height: 0.55rem;
    }
    .xzbj img{
        width: 36px;
        margin-top: 2px;
        margin-left: -5px;
    }
</style>

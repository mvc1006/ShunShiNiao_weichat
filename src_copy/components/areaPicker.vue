<template>
    <div class="city-picker" v-clickoutside="handleClickOutside">
        <label class="province" >
          <select 
            :value="value.province"
            @change="onchange('province', $event.target.value)">
            <option v-text="value.province || placeholder.province"></option>
            <option  v-for="(item,index) in provinceList" 
            :key="index"
            :selected="item.region_name === value.province"
            v-text="item.region_name">
            </option>
          </select>
        </label>

        <label class="city">
          <select
            :value="value.city"
            @change="onchange('city', $event.target.value)">
            <option v-text="value.city || placeholder.city"></option>
            <option  v-for="(item,index) in cityList" 
            :key="index"
            :selected="item.region_name === value.city"
            v-text="item.region_name">
            </option>
          </select>
        </label>
        <label class="district">
          <select
            :value="value.district"
            @change="onchange('district', $event.target.value)">
            <option v-text="value.district || placeholder.district"></option>
            <option  v-for="(item,index) in districtList" 
            :key="index"
            :selected="item.region_name === value.district"
            v-text="item.region_name">
            </option>
          </select>
        </label>
    </div>
</template>

<script>
import clickoutside from '@/js/clickoutside';
export default{
    props:{
        placeholder:{
            type:Object,
            default:()=>{
                return {
                    province:'请选择',
                    city:'请选择',
                    district:'请选择'
                }
            }
        },
        value:{
            type:Object,
            default:()=>{
                return {
                    province:'',
                    city:'',
                    district:''
                }
            }
        },
        change:{
            type:Function
        },
        hide:{
            type:Function
        }
    },
    data(){
        return {
            provinceValue: {},
            cityValue: {},
            districtValue: {},
            // 列表
            provinceList:[],
            cityList: [],
            districtList: []
        }
    },
    methods:{
        getData(params,type){
            this.dataService.getAreaList(params).then((resp)=>{
                this.dataService.handleResponse({
                    data:resp,
                    callback:(data)=>{
                        if(type == 'province'){
                            this.provinceList = [].concat(data)
                        }else if(type == 'city'){
                            this.cityList = [].concat(data)
                        }else if(type == 'district'){
                            this.districtList = [].concat(data)
                        }
                    }
                })
            })
        },
        handleClickOutside(){
            this.$eventBus.$emit('hideAreaPicker')
        },
        initProvince(data){
            this.provinceList = this.provinceList.concat(data)
        },
        onchange(type,value){
            if(type == 'province'){
                this.setData(this.provinceValue,this.provinceList,value);   
                this.cityList = [];
                this.cityValue = {};
                this.districtList = [];
                this.districtValue = {};
                // 获得市数据
                this.getData({
                    pid:this.provinceValue.region_id
                },'city')
            }else if(type == 'city'){
                this.setData(this.cityValue,this.cityList,value);
                this.districtList = [];
                this.districtValue = {};
                this.getData({
                    pid:this.cityValue.region_id
                },'district');
            }else if(type == 'district'){
                this.setData(this.districtValue,this.districtList,value);
                this.$emit('hide');
            }
            this.value[type] = value;
            this.$emit('change',{
                province:this.provinceValue,
                city:this.cityValue,
                district:this.districtValue,
            })

        },
        setData(obj,list,value){
            for(let i=0;i<list.length;i++){
                if(value == list[i].region_name){
                    obj.region_id = list[i].region_id;
                    obj.region_name = list[i].region_name;
                }
            }
        }
    },
    created(){
        this.getData({pid:0},'province');
    },
    directives:{
        clickoutside
    }
}
</script>
<style lang="less" scoped rel="stylesheet/less">
    @import url('../less/common.less');
    .city-picker{
        width: 100%;
        padding-left: 3%;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        .pxRem(top,20)
    }
    label{
        position: relative;
        float: left;
        box-sizing: border-box;
        width: 28%;
        overflow: hidden;
        // 三角形
        &:after, &:before{
            content: ' ';
            position: absolute;
            .pxRem(right,10);
            .pxRem(top,20);
            width: 0;
            height: 0;
            border: 6px solid transparent;

            border-left: 6px solid #fff;
        }
        &:before{
            border-left-color: #ccc;
            .pxRem(right,8);
        }
    }
    label + label{
        .pxRem(margin-left,20);
    }
    select{
        appearance:none;
        background:transparent;
        border:none;
        outline: none;
        .pxRem(padding-left,20);

        width: 100%;
        height:50%;
        .border(2);
        .borderRadius(2);
        
        color: #7a7a7a;
        .pxRem(line-height,60);
        .pxRem(font-size,24);
        cursor: pointer;
    }
</style>

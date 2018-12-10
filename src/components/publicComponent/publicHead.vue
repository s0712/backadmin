<template>
    <section class="publicHead">
        <h1>{{msg}}</h1>

    </section>
</template>
<script>
	export default{
		data(){
			return{

			}
        },
        props:['msg'],
		created(){
            console.log(this.msg)
		},
		methods:{
			
		},
	}
</script>
<style scoped lang="scss">
	.publicHead{
  
h1{
    height: 45px;
    line-height: 45px;
    // padding-left: 15px;
    margin-bottom: 15px;
    text-align: left;
    border-bottom: solid 1px #eff2f7;
}
    }
</style>
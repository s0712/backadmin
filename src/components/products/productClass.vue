<template>
    <section class="productClass">
        <public-head :msg="$route.meta.title"></public-head>
        <main>
            <el-tree :data="data5"
                     show-checkbox
                     node-key="id"
                     default-expand-all
                     :expand-on-click-node="false">
                <span class="custom-tree-node"
                      slot-scope="{ node, data }">
                    <span v-if="node.disabled">{{ node.label+111 }}</span>
                    <el-input v-if="node.can"
                              v-model="tempItem.label"></el-input>
                    <span>
                        <el-button v-if="node.disabled"
                                   type="text"
                                   size="mini"
                                   @click="() => edit(data)">
                            编辑
                        </el-button>
                        <el-button v-if="!node.disabled"
                                   type="text"
                                   size="mini"
                                   @click="() => update(data)">
                            保存
                        </el-button>
                        <el-button type="text"
                                   size="mini"
                                   @click="() => append(data)">
                            Append
                        </el-button>
                        <el-button type="text"
                                   size="mini"
                                   @click="() => remove(node, data)">
                            Delete
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </main>

    </section>
</template>
<script>
import publicHead from '../publicComponent/publicHead';
 let id = 1000;
	export default{
        components:{
           publicHead,
          
        },
		data(){
            
            var data = [{
                        id: 1,
                        label: '一级 1',
                        disabled:true,
                        children: [{
                            disabled:true,
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            disabled:true,
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            disabled:true,
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                        }]
                    }, {
                        id: 2,
                        label: '一级 2',
                        disabled:true,
                        children: [{
                            disabled:true,
                        id: 5,
                        label: '二级 2-1'
                        }, {
                            disabled:true,
                        id: 6,
                        label: '二级 2-2'
                        }]
                    }, {
                        id: 3,
                        label: '一级 3',
                        disabled:true,
                        children: [{
                            disabled:true,
                        id: 7,
                        label: '二级 3-1'
                        }, {
                            disabled:true,
                        id: 8,
                        label: '二级 3-2'
                        }]
                    }];
			return{
                    data5: JSON.parse(JSON.stringify(data)),
                    tempItem:{},
			}
		},
		created(){
                
		},
		methods:{
            edit(data){
                console.log(data);
                // this.tempItem=_.cloneDeep(data);
                this.tempItem=data;
                this.tempItem.can=true;
               setTimeout(() => {
                data.can=true
                    
                }, 0);
                console.log(this.tempItem)
                this.$set(data,'newLabel',data.label);
                this.$set(data,'disabled',false);
            },
            update(data){
                // Object.assign(data,this.tempItem);
                // data=_.cloneDeep(this.tempItem);
                console.log(data)
               this.$set(data,'disabled',true); 
               this.$set(this.tempItem,'can',false);
            },
        append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
		},
	}
</script>
<style lang="scss">
	.productClass{
         height: 100%;
         padding: 0 15px;
        background: #fff;
        display: flex;
        flex-direction: column;
    }
</style>
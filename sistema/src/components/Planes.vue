<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="title" label="Title">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="period" label="Period">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="description" label="Description">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="hours" label="Hours">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="price" label="Price">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="available" :items="availables" label="Available">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                    </div>
                                </v-flex>
                                </v-layout>
                            </v-container>
                            </v-card-text>
                
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="clientes"
                :search="search"
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.tipo_persona }}</td>
                    <td>{{ props.item.tipo_documento }}</td>
                    <td>{{ props.item.num_documento }}</td>
                    <td>{{ props.item.direccion }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.email }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                clientes:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Title', value: 'title' },
                    { text: 'Period', value: 'period' },
                    { text: 'Description', value: 'description' },
                    { text: 'Hours', value: 'hours', sortable: false  },
                    { text: 'Price', value: 'price', sortable: false  },
                    { text: 'Available', value: 'available', sortable: false  },
                    { text: 'Created At', value: 'createdAt', sortable: false  }                ,
                    { text: 'Updated At', value: 'updatedAt', sortable: false }
                ],
                search: '',
                editedIndex: -1,
                id: '',
                title: '',
                period: '',
                description: '',
                hours: '',
                price: '',
                available: '',
                availables: [true, false],
                createdAt: '',
                updatedAt: '',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''             
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Plan' : 'Update Plan'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
        },
        methods:{
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/plans/available',configuracion).then(function(response){
                    //console.log(response);
                    me.clientes=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.id=item.id;
                this.title=item.title;
                this.period=item.period;
                this.description=item.period;
                this.hours=item.hours;
                this.price=item.price;
                this.available=item.available;
                this.createdAt=item.createdAt;
                this.updatedAt=item.updatedAt;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.id="";
                this.title="";
                this.period="";
                this.description="";
                this.hours="";
                this.price="";
                this.available="";
                this.createdAt="";
                this.updatedAt="";
                this.editedIndex=-1;
            },
            guardar () {
                if (this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    let me=this;
                    axios.put('/api/plans/'+me.id,{
                        'id':me.id,
                        'title':me.title,
                        'period':me.period,
                        'description':me.description,
                        'hours':me.hours,
                        'available': me.available,
                        'createdAt':me.createdAt,
                        'updatedAt':me.updatedAt                      
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('/api/plans',{
                        'title':me.title,
                        'period':me.period,
                        'description':me.description,
                        'hours':me.hours,
                        'available': me.available,
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (this.nombre.length<3 || this.nombre.length>100){
                    this.validaMensaje.push("El nombre debe tener más de 3 caracteres y menos de 100 caracteres.");
                }
                if (!this.tipo_documento){
                    this.validaMensaje.push("Seleccione un sí el plan está habilitado o no.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            }
        }        
    }
</script>

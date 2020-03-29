/* eslint-disable no-undef */
;(() => {
  Vue.component('action-network-graphs', {
    template: `
            <div class="network-graph">
              <label>
              Jump to Action: 
              <select
                v-model="actionNodeSelected"
                @change="focusSelectedNode()"
              >
                <option
                  v-for="node in actionNodes"
                  :value="node"
                >
                  {{ node.label }}
                </option>
              </select>
              <label>

                <div ref="canvas" class="ngrx-action-canvas"></div>
            </div>
          `,
    data() {
      return {
        actionNodeSelected: null,
        visJsNetwork: null
      }
    },
    computed: {
      firstNode() {
        return this.nodes[0]
      },
      actionNodes() {
        if (!Array.isArray(this.nodes)) {
          return []
        }

        return this.nodes.filter(node => node.group === 'action')
      }
    },
    props: ['nodes', 'edges', 'options'],
    methods: {
      focusSelectedNode() {
        this.visJsNetwork.focus(this.actionNodeSelected.id, {
          scale: 0.7,
          offset: { x: -150, y: -250 }
        })
      }
    },
    mounted() {
      this.visJsNetwork = new vis.Network(
        this.$refs.canvas,
        { nodes: this.nodes, edges: this.edges },
        this.options
      )

      this.visJsNetwork.once('beforeDrawing', () => {
        this.visJsNetwork.focus(this.firstNode.id, {
          scale: 0.7,
          offset: { x: -150, y: -250 }
        })

        this.actionNodeSelected = this.firstNode
      })
    }
  })

  // eslint-disable-next-line no-unused-vars
  const app = new Vue({
    el: '#ngrx-vis',
    data: {
      networkNodes: JSON.parse('/* __NETWORK_NODES__ */'),
      networkEdges: JSON.parse('/* __NETWORK_EDGES__ */'),
      networkOptions: {
        nodes: {
          shape: 'dot',
          scaling: {
            min: 32,
            max: 64
          }
        },
        edges: {
          smooth: {
            type: 'cubicBezier',
            roundness: 0.4
          }
        },
        layout: {
          hierarchical: {
            direction: 'LR'
          }
        },
        groups: {
          action: {
            shape: 'diamond',
            size: 5,
            color: '#A82AC4'
          },
          component: {
            shape: 'square',
            color: '#DE7FA3',
            font: {
              multi: 'md'
            },
            size: 10
          },
          reducer: {
            color: '#5B2AC4'
          },
          effect: {
            color: '#2AC4A8',
            shape: 'square',
            size: 10
          },
          dispatch: {
            color: '#FC9B2E',
            size: 5
          }
        }
      }
    }
  })
})()

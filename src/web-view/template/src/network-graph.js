/* eslint-disable no-undef */
Vue.component('action-network-graphs', {
  template: `
  <div class="ngrx-vis">
    <div class="navigation">
      <div class="top-menu"></div>
      <div class="filter">
        <div class="filter-input-wrap">
          <input v-model="filter" type="text" class="filter-input" placeholder="Filter actions">
        </div>
      </div>
      <ul class="filter-results">
        <li 
          v-for="node in filteredActionNodes"
          :value="node"
          @click="focusSelectedNode(node)"
        >
          <h4 class="filter-result-title">{{ node.label }}</h4>
          <span class="filter-result-subtitle"></span>
        </li>
        
      </ul>
    </div>
    <div class="canvas" ref="canvas"></div>
  </div>
          `,
  data() {
    return {
      actionNodeSelected: null,
      visJsNetwork: null,
      filter: ''
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
    },
    filteredActionNodes() {
      if (!Array.isArray(this.nodes)) {
        return []
      }

      if (!this.filter) {
        return this.nodes.filter(node => node.group === 'action')
      }

      return this.nodes.filter(
        node =>
          node.group === 'action' &&
          node.label.toLowerCase().includes(this.filter.toLowerCase())
      )
    }
  },
  props: ['nodes', 'edges', 'options'],
  methods: {
    focusSelectedNode(node) {
      this.visJsNetwork.focus(node.id, {
        scale: 1,
        offset: { x: -100, y: -150 }
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
        scale: 1,
        offset: { x: -300, y: -150 }
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

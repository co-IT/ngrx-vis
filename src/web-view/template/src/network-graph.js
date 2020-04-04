/* eslint-disable no-undef */

Vue.component('action-network-graphs', {
  template: `
  <section class="ngrx-vis">
    <nav class="navigation">
      <div class="top-menu">
        <img 
          src="img/logo-black.svg"
          alt="logo: outlined, black shield with a black fish inside"
          class="ngrx-vis-logo"
        >
      </div>
      <form class="filter">
        <input v-model="filter" type="text" class="filter-input" placeholder="Filter actions">
      </form>
      <ul class="filter-results">
        <li 
          v-for="node in filteredActionNodes"
          :value="node"
          @click="focusSelectedNode(node)"
        >
          <span class="filter-result-title">{{ node.label }}</span>
          <span class="filter-result-subtitle"></span>
        </li>
      </ul>
    </nav>
    <div class="canvas" ref="canvas"></div>
  </section>
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
  el: '#vue-app',
  data: {
    networkNodes: JSON.parse('/* __NETWORK_NODES__ */'),
    networkEdges: JSON.parse('/* __NETWORK_EDGES__ */'),
    networkOptions: {
      physics: {
        stabilization: {
          enabled: true,
          iterations: 0,
          fit: true
        }
      },
      nodes: {
        shape: 'dot',
        size: 10,
        color: '#006DF0'
      },
      edges: {
        smooth: {
          type: 'cubicBezier',
          roundness: 0.4
        }
      },
      layout: {
        hierarchical: {
          direction: 'LR',
          sortMethod: 'directed'
        }
      },
      groups: {
        action: {
          shape: 'image',
          image: 'img/action.png'
        },
        component: {
          shape: 'image',
          image: 'img/component.png'
        },
        reducer: {
          shape: 'image',
          image: 'img/reducer.png'
        },
        effect: {
          shape: 'image',
          image: 'img/effect.png'
        },
        'effect-action': {
          shape: 'image',
          image: 'img/action.png',
          size: 10
        },
        dispatch: {
          color: '#DEDEDE',
          size: 5
        }
      }
    }
  }
})

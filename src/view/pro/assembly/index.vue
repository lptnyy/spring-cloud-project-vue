<template>
  <Row>
    <Col span="5">
      <Card>
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            基础组件
        </p>
        <vuedraggable class="left" v-model="list1" group="people" :options="dragOptions">
          <transition-group tag="div">
            <div v-for="item in list1" :key="item" class="item">
              <p>{{item}}</p>
            </div>
          </transition-group>
        </vuedraggable>
      </Card>
    </Col>
    <Col span="6" offset="1">
      <Card>
         <vuedraggable class="right" v-model="list2" group="people" :options="dragOptions">
          <transition-group tag="div">
            <div v-for="item in list2" :key="item" class="item">
              <p>{{item}}</p>
            </div>
          </transition-group>
        </vuedraggable>
      </Card>
    </Col>
    <Col span="11" offset="1">
      <Card>
      </Card>
    </Col>
  </Row>
</template>

<script>
import vuedraggable from 'vuedraggable'
export default {
  name: 'Assembly',
  components: {
    vuedraggable
  },
  data () {
    return {
      dragOptions: {
        animation: 120,
        scroll: true,
        group: 'sortlist',
        ghostClass: 'ghost-style'
      },
      list1: [1, 3, 5, 7, 9],
      list2: [2, 4, 6, 8, 10]
    }
  }
}
</script>

<style scoped>
</style>

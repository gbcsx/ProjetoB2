import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../config/supabase";

const Home = ({ navigation }) => {
  const [grupos, setGrupos] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchGrupos = async () => {
      const { data, error } = await supabase
    .from("grupos")
    .select(`
      id,
      nome,
      descricao,
      alunos (
        id,
        nome,
        email
      )
    `);
      if (error) {
        setFetchError("Erro ao buscar grupos.");
        setGrupos([]);
        console.error("Supabase error:", error.message);
      } else {
        setGrupos(data);
        setFetchError(null);
      }
    };

    fetchGrupos();
  }, []);

  const toggleExpandGroup = (groupName) => {
    if (expandedGroups.includes(groupName)) {
      setExpandedGroups(expandedGroups.filter((name) => name !== groupName));
    } else {
      setExpandedGroups([...expandedGroups, groupName]);
    }
  };

  return (
    <View style={styles.container}>
      {fetchError && <Text style={styles.error}>{fetchError}</Text>}
      <Text style={styles.groupsTitle}>Grupos InovaWeek</Text>
      <FlatList
        data={grupos}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleExpandGroup(item.nome)}
            >
              <Text style={styles.title}>{item.nome}</Text>
              <Text style={styles.subtitle}>{item.descricao}</Text>
            </TouchableOpacity>
            {expandedGroups.includes(item.nome) && (
              <View style={styles.details}>
                <Text style={styles.subtitle}>Alunos:</Text>
                {item.Aluno.length > 0 ? (
                  item.Aluno.map((aluno, index) => (
                    <View key={index} style={styles.alunoCard}>
                      <Text>Nome: {aluno.nome}</Text>
                      <Text>Email: {aluno.email}</Text>
                    </View>
                  ))
                ) : (
                  <Text>Nenhum aluno neste grupo</Text>
                )}
                <Text style={styles.subtitle}>Avaliações:</Text>
                {item.avaliacoes.length > 0 ? (
                  item.avaliacoes.map((avaliacao, index) => (
                    <View key={index} style={styles.avaliacaoCard}>
                      <Text>Nota: {avaliacao.nota}</Text>
                      <Text>Comentário: {avaliacao.comentario}</Text>
                    </View>
                  ))
                ) : (
                  <Text>Nenhuma avaliação neste grupo</Text>
                )}
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  listContainer: {
    paddingTop: 10,
  },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 5,
  },
  details: {
    marginTop: 10,
  },
  alunoCard: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  avaliacaoCard: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  groupsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;

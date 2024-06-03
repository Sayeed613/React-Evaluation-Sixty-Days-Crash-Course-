import { Container, Flex, SimpleGrid, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingIndicator from "../components/LoadingIndictor";
import ErrorIndictor from "../components/ErrorIndictor";
import ProductCard from "../components/ProductCard";

export default function Tickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [sortOrderValue, setSortOrderValue] = useState("");
  const [filterValue, setFilterValue] = useState("");

  async function fetchAndUpdateData(sortOrderValue, filterValue) {
    setLoading(true);
    setError(false); // Reset error state before fetching new data
    try {
      let queryParams = {};
      if (filterValue) {
        queryParams.filter = filterValue;
      }

      if (sortOrderValue) {
        queryParams.sort = "price";
        queryParams.order = sortOrderValue;
      }

      const response = await axios.get(
        `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-products`,
        { params: queryParams }
      );

      const data = response.data.data;
      setProducts(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAndUpdateData(sortOrderValue, filterValue);
  }, [sortOrderValue, filterValue]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorIndictor message="Failed to fetch products. Please try again later." />;
  }

  return (
    <Container maxW="5xl">
      <Flex
        direction={{ base: "column", md: "row" }}
        my={8}
        justifyContent="space-between"
      >
        <Select
          placeholder="Sort by Price"
          width={{ base: "100%", md: "40%" }}
          mb={{ base: 4, md: 0 }}
          value={sortOrderValue}
          onChange={(e) => setSortOrderValue(e.target.value)}
        >
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </Select>
        <Select
          placeholder="Filter by Category"
          width={{ base: "100%", md: "40%" }}
          mb={{ base: 4, md: 0 }}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="homedecor">Home Decor</option>
        </Select>
      </Flex>
      <Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </SimpleGrid>
      </Flex>
    </Container>
  );
}